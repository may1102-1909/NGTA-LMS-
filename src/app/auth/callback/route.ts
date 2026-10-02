import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/types/roles";

export const dynamic = "force-dynamic";

const VALID_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "INSTRUCTOR",
  "LEARNER",
  "GUEST",
];

function getDashboardRouteForRole(role: UserRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/dashboard/super-admin";
    case "ADMIN":
      return "/dashboard/admin";
    case "INSTRUCTOR":
      return "/dashboard/instructor";
    case "LEARNER":
    case "GUEST":
    default:
      return "/dashboard/learner";
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const queryRole = searchParams.get("role")?.toUpperCase();

  if (code) {
    const cookieStore = await cookies();
    const cookieRole = cookieStore.get("ngta_selected_role")?.value?.toUpperCase();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore in server route
            }
          },
        },
      }
    );

    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session?.user) {
      const user = session.user;
      const metadataRole = String(
        user.user_metadata?.role || user.app_metadata?.role || ""
      ).toUpperCase();

      // Priority: query param role > cookie role > metadata role > default LEARNER
      let targetRole: UserRole = "LEARNER";
      const candidateRole = queryRole || cookieRole || metadataRole;
      if (VALID_ROLES.includes(candidateRole as UserRole)) {
        targetRole = candidateRole as UserRole;
      }

      // Sync into Supabase PostgreSQL profiles table via Prisma
      try {
        const existingProfile = await prisma.profiles.findFirst({
          where: {
            OR: [{ user_id: user.id }, { id: user.id }, { email: user.email || "" }],
          },
        });

        if (existingProfile) {
          // If existing profile already has a role assigned, keep existing role unless candidate was explicitly chosen
          targetRole = (existingProfile.role as UserRole) || targetRole;

          await prisma.profiles.update({
            where: { id: existingProfile.id },
            data: {
              user_id: user.id,
              full_name:
                existingProfile.full_name ||
                user.user_metadata?.full_name ||
                user.email?.split("@")[0],
              avatar_url: existingProfile.avatar_url || user.user_metadata?.avatar_url || null,
              role: targetRole,
            },
          });
        } else {
          // Fresh profile insert
          await prisma.profiles.create({
            data: {
              id: user.id,
              user_id: user.id,
              email: user.email || `${user.id}@ngta.in`,
              full_name:
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email?.split("@")[0] ||
                "New Member",
              avatar_url: user.user_metadata?.avatar_url || null,
              role: targetRole,
            },
          });
        }
      } catch (dbErr) {
        console.error("Error upserting profile in auth callback:", dbErr);
      }

      // Determine target destination
      const redirectPath = getDashboardRouteForRole(targetRole);

      // Set cookie for role persistence in middleware
      cookieStore.set("ngta_user_role", targetRole, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
      });

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  // Return to error page if exchange failed
  return NextResponse.redirect(`${origin}/?error=auth-code-error`);
}
