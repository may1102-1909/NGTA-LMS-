import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

// Allowed roles for Course Management Suite uploads
const AUTHORIZED_ROLES = ["SUPER_ADMIN", "ADMIN", "INSTRUCTOR"];

async function getAuthorizedUser() {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) return null;

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch role from Prisma profiles
    const profile = await prisma.profiles.findFirst({
      where: {
        OR: [{ user_id: user.id }, { id: user.id }],
      },
    });

    const role = (profile?.role || user.user_metadata?.role || "").toUpperCase();

    if (!AUTHORIZED_ROLES.includes(role)) {
      return { authorized: false, user, role };
    }

    return { authorized: true, user, role, profile };
  } catch (err) {
    console.error("Auth check failed in /api/courses/upload:", err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthorizedUser();

    if (!auth || !auth.authorized) {
      return NextResponse.json(
        {
          error: "Unauthorized: Course asset uploads are restricted to Instructors, Admins, and Super Admins.",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const requestedBucket = (formData.get("bucket") as string) || "course-media";
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file payload provided" }, { status: 400 });
    }

    // Validate bucket
    const validBuckets = ["course-media", "course-videos"];
    if (!validBuckets.includes(requestedBucket)) {
      return NextResponse.json(
        { error: `Invalid storage bucket. Allowed: ${validBuckets.join(", ")}` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const cleanBase = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 50);
    const uniquePath = `${folder}/${Date.now()}_${cleanBase}.${ext}`;

    const contentType = file.type || (ext === "mp4" ? "video/mp4" : ext === "pdf" ? "application/pdf" : "application/octet-stream");

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(requestedBucket)
      .upload(uniquePath, buffer, {
        contentType,
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase storage upload error:", uploadError);
      return NextResponse.json(
        { error: `Storage upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Generate public URL
    const { data: publicData } = supabaseAdmin.storage
      .from(requestedBucket)
      .getPublicUrl(uniquePath);

    return NextResponse.json({
      success: true,
      publicUrl: publicData.publicUrl,
      path: uniquePath,
      bucket: requestedBucket,
      fileName: file.name,
      size: file.size,
      contentType,
    });
  } catch (error: any) {
    console.error("Error in course file upload endpoint:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server upload failure" },
      { status: 500 }
    );
  }
}
