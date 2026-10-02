/**
 * Google Drive Stream Processor (lib/gdriveProcessor.ts)
 * 
 * BRD Course Management Suite Utility:
 * - Detects Google Drive file URLs and open/share links
 * - Extracts Google Drive File IDs
 * - Converts links sequentially into sanitized, CSP-compliant embeddable/streamable preview URLs:
 *   https://drive.google.com/file/d/FILE_ID/preview
 * - Processes lesson queues sequentially to guarantee order and avoid concurrency bottlenecks
 */

export interface GDriveProcessResult {
  originalUrl: string;
  sanitizedUrl: string;
  fileId: string | null;
  isDriveUrl: boolean;
  success: boolean;
}

/**
 * Extracts the file ID from various Google Drive URL formats.
 */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();

  // Pattern 1: /file/d/FILE_ID/
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return fileDMatch[1];
  }

  // Pattern 2: id=FILE_ID (e.g. open?id=... or uc?id=...)
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return idParamMatch[1];
  }

  // Pattern 3: /folders/FILE_ID or /presentation/d/FILE_ID
  const genericDocMatch = trimmed.match(/\/(?:folders|document|presentation)\/d\/([a-zA-Z0-9_-]+)/);
  if (genericDocMatch && genericDocMatch[1]) {
    return genericDocMatch[1];
  }

  // If already looks like a raw Google Drive ID (25-45 chars of standard base64url characters)
  if (/^[a-zA-Z0-9_-]{25,45}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Checks if a given URL is a Google Drive resource.
 */
export function isGoogleDriveLink(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  return /drive\.google\.com|docs\.google\.com/i.test(url) || extractGoogleDriveFileId(url) !== null;
}

/**
 * Converts a Google Drive URL into an embeddable stream preview URL:
 * https://drive.google.com/file/d/FILE_ID/preview
 */
export function toGoogleDrivePreviewUrl(url: string): GDriveProcessResult {
  const fileId = extractGoogleDriveFileId(url);

  if (!fileId) {
    return {
      originalUrl: url,
      sanitizedUrl: url,
      fileId: null,
      isDriveUrl: isGoogleDriveLink(url),
      success: false,
    };
  }

  const sanitizedUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  return {
    originalUrl: url,
    sanitizedUrl,
    fileId,
    isDriveUrl: true,
    success: true,
  };
}

/**
 * Sleep helper for sequential pacing in queue processing.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface LessonProcessingInput {
  id?: string;
  title: string;
  durationMinutes?: number;
  videoType?: "MP4_UPLOAD" | "GOOGLE_DRIVE" | "YOUTUBE" | string;
  videoUrl: string;
  pdfResourceUrl?: string | null;
  content?: string;
  [key: string]: any;
}

export interface ModuleProcessingInput {
  id?: string;
  title: string;
  order?: number;
  order_index?: number;
  lessons: LessonProcessingInput[];
  chapters?: any[];
  [key: string]: any;
}

/**
 * Sequentially processes an array of lessons, transforming any Google Drive video links
 * into sanitized preview streams.
 */
export async function processLessonsSequentially(
  lessons: LessonProcessingInput[],
  logPrefix = "[GDrive Queue]"
): Promise<LessonProcessingInput[]> {
  const processed: LessonProcessingInput[] = [];

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i];
    const isDrive = lesson.videoType === "GOOGLE_DRIVE" || isGoogleDriveLink(lesson.videoUrl);

    if (isDrive && lesson.videoUrl) {
      const result = toGoogleDrivePreviewUrl(lesson.videoUrl);
      console.log(
        `${logPrefix} Item ${i + 1}/${lessons.length}: Sanitized Google Drive link for lesson "${lesson.title}":`,
        result.sanitizedUrl
      );

      processed.push({
        ...lesson,
        videoType: "GOOGLE_DRIVE",
        videoUrl: result.sanitizedUrl,
      });
    } else {
      processed.push(lesson);
    }

    // Small sequential yield to guarantee stable ordering and prevent lock contention
    await sleep(25);
  }

  return processed;
}

/**
 * Sequentially processes an entire curriculum module tree.
 */
export async function processModulesStreamTree(
  modules: ModuleProcessingInput[]
): Promise<ModuleProcessingInput[]> {
  const result: ModuleProcessingInput[] = [];

  for (let mIdx = 0; mIdx < modules.length; mIdx++) {
    const mod = modules[mIdx];
    let sanitizedLessons: LessonProcessingInput[] = [];

    if (Array.isArray(mod.lessons) && mod.lessons.length > 0) {
      sanitizedLessons = await processLessonsSequentially(
        mod.lessons,
        `[Module ${mIdx + 1} Queue]`
      );
    }

    // If chapters structure is used
    let sanitizedChapters: any[] = [];
    if (Array.isArray(mod.chapters) && mod.chapters.length > 0) {
      for (const chap of mod.chapters) {
        if (Array.isArray(chap.lessons)) {
          const chapLessons = await processLessonsSequentially(
            chap.lessons,
            `[Module ${mIdx + 1} Chapter Queue]`
          );
          sanitizedChapters.push({ ...chap, lessons: chapLessons });
        } else {
          sanitizedChapters.push(chap);
        }
      }
    }

    result.push({
      ...mod,
      lessons: sanitizedLessons,
      chapters: sanitizedChapters.length > 0 ? sanitizedChapters : mod.chapters,
    });
  }

  return result;
}
