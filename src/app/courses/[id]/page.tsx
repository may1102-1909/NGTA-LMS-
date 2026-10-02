import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { INITIAL_COURSES } from "@/lib/mockData";
import CourseDetailClient, { CourseDetailData } from "./CourseDetailClient";

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id;

  if (!id) {
    notFound();
  }

  // Check if identifier is a valid UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

  let dbPublishedCourse: any = null;
  let dbNormalizedCourse: any = null;

  try {
    if (isUuid) {
      // 1. Fetch exact course by ID or Slug from Supabase
      dbPublishedCourse = await prisma.published_courses.findFirst({
        where: {
          OR: [{ id: id }, { slug: id }],
        },
        include: {
          instructor: true,
        },
      });

      dbNormalizedCourse = await prisma.courses.findFirst({
        where: { id: id },
        include: {
          modules: {
            orderBy: { order_index: "asc" },
            include: {
              lessons: true,
            },
          },
          instructor: true,
        },
      });
    } else {
      // Query published_courses by slug
      dbPublishedCourse = await prisma.published_courses.findFirst({
        where: { slug: id },
        include: {
          instructor: true,
        },
      });

      // If found, fetch matching relational course record
      const resolvedCourseId = dbPublishedCourse?.id;
      if (resolvedCourseId) {
        dbNormalizedCourse = await prisma.courses.findFirst({
          where: { id: resolvedCourseId },
          include: {
            modules: {
              orderBy: { order_index: "asc" },
              include: {
                lessons: true,
              },
            },
            instructor: true,
          },
        });
      }
    }
  } catch (err) {
    console.error("Error fetching course dynamically from Supabase/Prisma:", err);
  }

  // Fallback to mock data only if not found in database (e.g., demo static courses)
  const mockCourse = INITIAL_COURSES.find((c) => c.slug === id || c.id === id);

  // 2. Return 404 if course ID/Slug does not exist in DB or mock catalog
  if (!dbPublishedCourse && !dbNormalizedCourse && !mockCourse) {
    notFound();
  }

  // 3. Bind UI components dynamically to course record
  const courseId = dbNormalizedCourse?.id || dbPublishedCourse?.id || mockCourse?.id || id;
  const courseSlug = dbPublishedCourse?.slug || mockCourse?.slug || id;
  const courseTitle =
    dbNormalizedCourse?.title || dbPublishedCourse?.title || mockCourse?.title || "Untitled Course";
  const courseSubtitle =
    dbNormalizedCourse?.subtitle ||
    (dbPublishedCourse?.description ? dbPublishedCourse.description.slice(0, 160) : "") ||
    mockCourse?.subtitle ||
    "";
  const courseDescription =
    dbNormalizedCourse?.description ||
    dbPublishedCourse?.description ||
    mockCourse?.description ||
    "";
  const category =
    dbNormalizedCourse?.category ||
    dbPublishedCourse?.category ||
    mockCourse?.category ||
    "Automation Testing";
  const difficultyLevel =
    dbNormalizedCourse?.difficulty_level ||
    dbPublishedCourse?.level ||
    mockCourse?.difficultyLevel ||
    "BEGINNER";
  const updatedAt = new Date(
    dbNormalizedCourse?.updated_at ||
      dbPublishedCourse?.updated_at ||
      Date.now()
  )
    .toISOString()
    .split("T")[0];

  const instructorName =
    dbNormalizedCourse?.instructor?.full_name ||
    dbPublishedCourse?.instructor?.full_name ||
    dbPublishedCourse?.instructor_name ||
    mockCourse?.instructorName ||
    "Lead Instructor";
  const instructorTitle = "Lead SDET & Founder";
  const instructorBio =
    "Lead SDET Instructor at NextGen Testing Academy (NGTA).";
  const instructorAvatarUrl =
    dbNormalizedCourse?.instructor?.avatar_url ||
    dbPublishedCourse?.instructor?.avatar_url ||
    mockCourse?.instructorAvatarUrl ||
    "/instructor/rahul-kamat.png";

  const thumbnailUrl =
    dbNormalizedCourse?.thumbnail_url ||
    mockCourse?.thumbnailUrl ||
    "/courses/selenium-java-ai.jpg";
  const bannerUrl =
    dbNormalizedCourse?.banner_url ||
    mockCourse?.bannerUrl ||
    "/courses/selenium-java-ai.jpg";

  const discountPriceINR = Number(
    dbNormalizedCourse?.discount_price ??
      dbNormalizedCourse?.pricing ??
      dbPublishedCourse?.price ??
      mockCourse?.discountPriceINR ??
      1999
  );

  const priceINR = Number(
    dbNormalizedCourse?.pricing
      ? Math.round(Number(dbNormalizedCourse.pricing) * 1.5)
      : dbPublishedCourse?.price
      ? Math.round(Number(dbPublishedCourse.price) * 1.5)
      : mockCourse?.priceINR ?? 3999
  );

  const durationHours = dbNormalizedCourse?.course_duration
    ? Math.round(Number(dbNormalizedCourse.course_duration) / 60)
    : mockCourse?.durationHours || 20;

  const objectives =
    (dbNormalizedCourse?.course_objectives && dbNormalizedCourse.course_objectives.length > 0
      ? dbNormalizedCourse.course_objectives
      : null) ||
    mockCourse?.objectives || [
      "Architect enterprise-grade test automation frameworks from scratch",
      "Master parallel test orchestration with Docker and GitHub Actions",
    ];

  const prerequisites =
    (dbNormalizedCourse?.prerequisites && dbNormalizedCourse.prerequisites.length > 0
      ? dbNormalizedCourse.prerequisites
      : null) ||
    mockCourse?.prerequisites || [
      "Basic knowledge of JavaScript, TypeScript or Python",
      "Command line familiarity & Node.js installed",
    ];

  const targetAudience =
    (dbNormalizedCourse?.target_audience && dbNormalizedCourse.target_audience.length > 0
      ? dbNormalizedCourse.target_audience
      : null) ||
    mockCourse?.targetAudience || [
      "Manual QA Testers transitioning to SDET roles",
      "Frontend & Backend Engineers needing automated test coverage",
    ];

  // Resolve curriculum modules and lessons dynamically
  let modules: CourseDetailData["modules"] = [];
  if (dbNormalizedCourse?.modules && dbNormalizedCourse.modules.length > 0) {
    modules = dbNormalizedCourse.modules.map((m: any, mIdx: number) => ({
      id: m.id,
      title: m.title || `Module ${mIdx + 1}`,
      chapters: [
        {
          id: `${m.id}-ch1`,
          title: "Curriculum & Lessons",
          lessons: (m.lessons || []).map((l: any, lIdx: number) => ({
            id: l.id,
            title: l.title || `Lesson ${lIdx + 1}`,
            type: l.video_type ? "video" : (l.type || "video"),
            durationMinutes: l.duration_minutes || l.durationMinutes || 15,
            videoUrl: l.video_url || "",
            pdfResourceUrl: l.pdf_resource_url || null,
          })),
        },
      ],
    }));
  } else if (Array.isArray(dbPublishedCourse?.modules) && dbPublishedCourse.modules.length > 0) {
    modules = dbPublishedCourse.modules.map((m: any, mIdx: number) => {
      if (Array.isArray(m.chapters) && m.chapters.length > 0) {
        return {
          id: m.id || `mod-${mIdx + 1}`,
          title: m.title || `Module ${mIdx + 1}`,
          chapters: m.chapters,
        };
      }
      return {
        id: m.id || `mod-${mIdx + 1}`,
        title: m.title || `Module ${mIdx + 1}`,
        chapters: [
          {
            id: `${m.id || mIdx}-ch1`,
            title: "Curriculum & Lessons",
            lessons: (Array.isArray(m.lessons) ? m.lessons : []).map((l: any, lIdx: number) => ({
              id: l.id || `les-${lIdx + 1}`,
              title: l.title || `Lesson ${lIdx + 1}`,
              type: l.videoType ? "video" : (l.type || "video"),
              durationMinutes: l.durationMinutes || 15,
              videoUrl: l.videoUrl || "",
              pdfResourceUrl: l.pdfResourceUrl || null,
            })),
          },
        ],
      };
    });
  } else if (mockCourse?.modules) {
    modules = mockCourse.modules;
  }

  const courseData: CourseDetailData = {
    id: courseId,
    slug: courseSlug,
    title: courseTitle,
    subtitle: courseSubtitle,
    description: courseDescription,
    category,
    difficultyLevel,
    updatedAt,
    instructorName,
    instructorTitle,
    instructorBio,
    instructorAvatarUrl,
    thumbnailUrl,
    bannerUrl,
    priceINR,
    discountPriceINR,
    durationHours,
    objectives,
    prerequisites,
    targetAudience,
    modules,
  };

  return <CourseDetailClient course={courseData} />;
}
