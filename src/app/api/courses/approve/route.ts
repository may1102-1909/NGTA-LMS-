import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseId, action = "APPROVE" } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    const newStatus = action === "APPROVE" ? "PUBLISHED" : "REJECTED";

    // BRD Section 45: Admin approves course -> Status changes to PUBLISHED. Course automatically appears on public course storefront page.
    const updatedCourse = await prisma.published_courses.update({
      where: { id: courseId },
      data: {
        status: newStatus,
        updated_at: new Date(),
      },
    });

    // Revalidate storefront pages
    try {
      revalidatePath("/courses");
      revalidatePath("/lms");
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Course status successfully updated to ${newStatus}.`,
      course: updatedCourse,
      status: newStatus,
    });
  } catch (error: any) {
    console.error("Error approving/rejecting course:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update course approval status" },
      { status: 500 }
    );
  }
}
