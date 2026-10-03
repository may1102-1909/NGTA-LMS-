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

  const decodedId = decodeURIComponent(id);
  const titleSearch = decodedId.replace(/-/g, " ");

  let dbPublishedCourse: any = null;
  let dbNormalizedCourse: any = null;

  try {
    // 1. Fetch exact course by ID, Slug, Slug prefix, or Title dynamically from Supabase/Prisma
    const publishedWhere: any = isUuid
      ? {
          OR: [
            { id: id },
            { slug: id },
          ],
        }
      : {
          OR: [
            { slug: id },
            { slug: { startsWith: id } },
            { title: { equals: id, mode: "insensitive" } },
            { title: { equals: decodedId, mode: "insensitive" } },
            { title: { equals: titleSearch, mode: "insensitive" } },
            { title: { contains: titleSearch, mode: "insensitive" } },
          ],
        };

    dbPublishedCourse = await prisma.published_courses.findFirst({
      where: publishedWhere,
      include: {
        instructor: true,
      },
    });

    const normalizedWhere: any = isUuid
      ? { id: id }
      : {
          OR: [
            ...(dbPublishedCourse?.id ? [{ id: dbPublishedCourse.id }] : []),
            { title: { equals: id, mode: "insensitive" } },
            { title: { equals: decodedId, mode: "insensitive" } },
            { title: { equals: titleSearch, mode: "insensitive" } },
            { title: { contains: titleSearch, mode: "insensitive" } },
          ],
        };

    dbNormalizedCourse = await prisma.courses.findFirst({
      where: normalizedWhere,
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

    if (dbNormalizedCourse?.id && !dbPublishedCourse) {
      dbPublishedCourse = await prisma.published_courses.findFirst({
        where: { id: dbNormalizedCourse.id },
        include: { instructor: true },
      }).catch(() => null);
    }
  } catch (err) {
    console.error("Error fetching course dynamically from Supabase/Prisma:", err);
  }

  // Fallback to mock data ONLY if completely absent in database
  const mockCourse = (!dbPublishedCourse && !dbNormalizedCourse)
    ? INITIAL_COURSES.find((c) => c.slug === id || c.id === id || c.title?.toLowerCase() === titleSearch.toLowerCase())
    : null;

  // Safe Guard Clause: Return clean Course Not Found UI instead of fatal crash
  if (!dbPublishedCourse && !dbNormalizedCourse && !mockCourse) {
    return (
      <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-6 font-sans">
        <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
        <p className="text-zinc-400 text-sm mb-6">The requested course does not exist or is still pending publication.</p>
        <a href="/courses" className="px-5 py-2.5 bg-lime-400 text-black font-bold rounded-xl hover:bg-lime-300 transition-colors">Back to Courses</a>
      </div>
    );
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
      id: m?.id || `mod-${mIdx + 1}`,
      title: m?.title || `Module ${mIdx + 1}`,
      chapters: [
        {
          id: `${m?.id || mIdx}-ch1`,
          title: "Curriculum & Lessons",
          lessons: (m?.lessons || []).map((l: any, lIdx: number) => ({
            id: l?.id || `les-${lIdx + 1}`,
            title: l?.title || `Lesson ${lIdx + 1}`,
            type: l?.video_type ? "video" : (l?.type || "video"),
            durationMinutes: Number(l?.duration_minutes || l?.durationMinutes || l?.duration) || 15,
            videoUrl: (l?.video_url || l?.videoUrl || "").trim(),
            video_url: (l?.video_url || l?.videoUrl || "").trim(),
            videoType: l?.video_type || l?.videoType || "MP4_UPLOAD",
            video_type: l?.video_type || l?.videoType || "MP4_UPLOAD",
            pdfResourceUrl: l?.pdf_resource_url || l?.pdfResourceUrl || null,
          })),
        },
      ],
    }));
  } else if (Array.isArray(dbPublishedCourse?.modules) && dbPublishedCourse.modules.length > 0) {
    modules = dbPublishedCourse.modules.map((m: any, mIdx: number) => {
      if (Array.isArray(m?.chapters) && m.chapters.length > 0) {
        return {
          id: m?.id || `mod-${mIdx + 1}`,
          title: m?.title || `Module ${mIdx + 1}`,
          chapters: m.chapters.map((chap: any, cIdx: number) => ({
            id: chap?.id || `chap-${mIdx + 1}-${cIdx + 1}`,
            title: chap?.title || `Chapter ${cIdx + 1}`,
            lessons: (chap?.lessons || []).map((l: any, lIdx: number) => ({
              id: l?.id || `les-${lIdx + 1}`,
              title: l?.title || `Lesson ${lIdx + 1}`,
              type: l?.videoType || l?.video_type ? "video" : (l?.type || "video"),
              durationMinutes: Number(l?.durationMinutes || l?.duration_minutes || l?.duration) || 15,
              videoUrl: (l?.videoUrl || l?.video_url || "").trim(),
              video_url: (l?.video_url || l?.videoUrl || "").trim(),
              videoType: l?.video_type || l?.videoType || "MP4_UPLOAD",
              video_type: l?.video_type || l?.videoType || "MP4_UPLOAD",
              pdfResourceUrl: l?.pdfResourceUrl || l?.pdf_resource_url || null,
            })),
          })),
        };
      }
      return {
        id: m?.id || `mod-${mIdx + 1}`,
        title: m?.title || `Module ${mIdx + 1}`,
        chapters: [
          {
            id: `${m?.id || mIdx}-ch1`,
            title: "Curriculum & Lessons",
            lessons: (Array.isArray(m?.lessons) ? m.lessons : []).map((l: any, lIdx: number) => ({
              id: l?.id || `les-${lIdx + 1}`,
              title: l?.title || `Lesson ${lIdx + 1}`,
              type: l?.videoType || l?.video_type ? "video" : (l?.type || "video"),
              durationMinutes: Number(l?.durationMinutes || l?.duration_minutes || l?.duration) || 15,
              videoUrl: (l?.video_url || l?.videoUrl || "").trim(),
              video_url: (l?.video_url || l?.videoUrl || "").trim(),
              videoType: l?.video_type || l?.videoType || "MP4_UPLOAD",
              video_type: l?.video_type || l?.videoType || "MP4_UPLOAD",
              pdfResourceUrl: l?.pdfResourceUrl || l?.pdf_resource_url || null,
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
