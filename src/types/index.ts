export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "INSTRUCTOR"
  | "CONTENT_MANAGER"
  | "SUPPORT_STAFF"
  | "LEARNER"
  | "GUEST";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  headline?: string;
  timezone?: string;
  createdAt: string;
}

export type CourseState =
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "UNPUBLISHED"
  | "ARCHIVED";

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  order: number;
  durationMinutes: number;
  type: "video" | "audio" | "pdf" | "document" | "text" | "quiz" | "assignment";
  videoUrl?: string;
  content?: string;
  isCompleted?: boolean;
  playbackPositionSeconds?: number;
  dripDaysAfterEnrollment?: number;
}

export interface Chapter {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
  chapters: Chapter[];
  isLocked?: boolean;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  instructorId: string;
  instructorName: string;
  instructorTitle: string;
  instructorAvatarUrl?: string;
  instructorBio?: string;
  category: string;
  tags: string[];
  thumbnailUrl: string;
  bannerUrl: string;
  difficultyLevel: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  durationHours: number;
  priceINR: number;
  discountPriceINR: number;
  status: CourseState;
  objectives: string[];
  prerequisites: string[];
  targetAudience: string[];
  rating: number;
  ratingsCount: number;
  studentsCount: number;
  modules: Module[];
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionText: string;
  type: "single_choice" | "multiple_choice" | "true_false" | "fill_blank" | "short_answer";
  options?: { id: string; text: string }[];
  correctAnswer: string | string[];
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  passingPercentage: number;
  timeLimitMinutes: number;
  maxAttempts: number;
  questions: QuizQuestion[];
}

export interface Certificate {
  id: string;
  certificateId: string; // e.g. "NGTA-CERT-2026-8891"
  learnerId: string;
  learnerName: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  issuedAt: string;
  verificationUrl: string;
  status: "VALID" | "REVOKED";
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progressPercentage: number;
  lastAccessedLessonId?: string;
  completedAt?: string;
  certificateIssued?: boolean;
  completedLessonIds: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  courseId?: string;
  membershipPlanId?: string;
  amountINR: number;
  discountINR: number;
  currency: string;
  paymentMethod: "UPI" | "CARD" | "NET_BANKING" | "WALLET";
  status: "INITIATED" | "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED" | "CANCELLED";
  createdAt: string;
  transactionId: string;
}

export interface LiveSession {
  id: string;
  title: string;
  instructorName: string;
  date: string;
  startTime: string;
  endTime: string;
  courseId?: string;
  capacity: number;
  meetingUrl: string;
  status: "UPCOMING" | "LIVE" | "COMPLETED";
  isRegistered?: boolean;
}

export interface CommunityPost {
  id: string;
  channelId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  reactions: { emoji: string; count: number }[];
  repliesCount: number;
}
