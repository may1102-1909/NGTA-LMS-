// BRD Section 38 Data Model & Section 23 Gamification Configuration
// Aesthetic: Technical systems-console, monospace, tabular numerals

export interface RankTier {
  id: string;
  name: string;
  code: string;
  minPoints: number;
  nextTierPoints: number | null;
  description: string;
}

export const RANK_TIERS: RankTier[] = [
  {
    id: "trainee",
    name: "Trainee",
    code: "TRAINEE",
    minPoints: 0,
    nextTierPoints: 100,
    description: "Foundational QA & Manual Testing Essentials",
  },
  {
    id: "associate",
    name: "Associate",
    code: "ASSOCIATE",
    minPoints: 100,
    nextTierPoints: 250,
    description: "Basic Automation Scripting & Test Execution",
  },
  {
    id: "sdet-1",
    name: "SDET-I",
    code: "SDET-I",
    minPoints: 250,
    nextTierPoints: 400,
    description: "Independent Test Suite Authoring & Locator Mastery",
  },
  {
    id: "sdet-2",
    name: "SDET-II",
    code: "SDET-II",
    minPoints: 400,
    nextTierPoints: 750,
    description: "Framework Architecture, ThreadLocal & CI/CD Pipelines",
  },
  {
    id: "lead",
    name: "Lead",
    code: "LEAD",
    minPoints: 750,
    nextTierPoints: null,
    description: "Principal Test Architect & Enterprise QA Strategy",
  },
];

export function getRankTier(points: number): RankTier {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (points >= RANK_TIERS[i].minPoints) {
      return RANK_TIERS[i];
    }
  }
  return RANK_TIERS[0];
}

export function getRankProgress(points: number): {
  currentTier: RankTier;
  nextTier: RankTier | null;
  pointsInTier: number;
  pointsNeeded: number;
  percentage: number;
} {
  const currentTier = getRankTier(points);
  const nextTierIndex = RANK_TIERS.findIndex((t) => t.id === currentTier.id) + 1;
  const nextTier = nextTierIndex < RANK_TIERS.length ? RANK_TIERS[nextTierIndex] : null;

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      pointsInTier: points - currentTier.minPoints,
      pointsNeeded: 0,
      percentage: 100,
    };
  }

  const range = nextTier.minPoints - currentTier.minPoints;
  const pointsInTier = Math.max(0, points - currentTier.minPoints);
  const pointsNeeded = nextTier.minPoints - points;
  const percentage = Math.min(100, Math.round((pointsInTier / range) * 100));

  return {
    currentTier,
    nextTier,
    pointsInTier,
    pointsNeeded,
    percentage,
  };
}

export interface GamificationPoint {
  id: string;
  points: number;
  type: "LESSON" | "QUIZ" | "CHALLENGE" | "COMMUNITY" | "STREAK";
  description: string;
  context: string;
  timestamp: string;
}

export interface DayStreak {
  date: string;
  dayLabel: string;
  active: boolean;
  isToday: boolean;
  pointsEarned: number;
}

export interface CredentialItem {
  id: string;
  code: string;
  title: string;
  description: string;
  type: "CERTIFICATE" | "BADGE";
  isVerified: boolean;
  issuedAt: string;
  verificationId?: string;
  tier?: string;
  category: string;
  courseTitle?: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  handle: string;
  cohort: string;
  courseId: string;
  points: number;
  streakDays: number;
  rankCode: string;
  isCurrentUser?: boolean;
}

export interface ChallengeTask {
  dayNumber: number;
  title: string;
  commandSnippet?: string;
  isCompleted: boolean;
  completedAt?: string;
  pointsReward: number;
}

// Initial Event Ledger (Newest at top)
export const INITIAL_REPUTATION_LOG: GamificationPoint[] = [
  {
    id: "pt-log-1",
    points: 10,
    type: "LESSON",
    description: "Lesson completed",
    context: "Selenium Module 3",
    timestamp: "10 mins ago",
  },
  {
    id: "pt-log-2",
    points: 15,
    type: "COMMUNITY",
    description: "Community peer response",
    context: "ThreadLocal WebDriver discussion",
    timestamp: "2 hours ago",
  },
  {
    id: "pt-log-3",
    points: 50,
    type: "QUIZ",
    description: "Assessment passed (100%)",
    context: "W3C Protocol & TestNG Quiz",
    timestamp: "1 day ago",
  },
  {
    id: "pt-log-4",
    points: 25,
    type: "CHALLENGE",
    description: "Daily challenge milestone",
    context: "Day 07 ▸ First Selenium WebDriver script",
    timestamp: "1 day ago",
  },
  {
    id: "pt-log-5",
    points: 10,
    type: "LESSON",
    description: "Lesson completed",
    context: "Mastering XPath Axes & CSS Selectors",
    timestamp: "2 days ago",
  },
  {
    id: "pt-log-6",
    points: 10,
    type: "LESSON",
    description: "Lesson completed",
    context: "Introduction to W3C WebDriver Protocol",
    timestamp: "3 days ago",
  },
  {
    id: "pt-log-7",
    points: 300,
    type: "STREAK",
    description: "7-Day Streak Achiever",
    context: "Unbroken telemetry cadence",
    timestamp: "3 days ago",
  },
];

// 7-day and 30-day streak data
export const INITIAL_STREAK_DAYS: DayStreak[] = [
  { date: "2026-03-13", dayLabel: "FRI", active: true, isToday: false, pointsEarned: 20 },
  { date: "2026-03-14", dayLabel: "SAT", active: true, isToday: false, pointsEarned: 35 },
  { date: "2026-03-15", dayLabel: "SUN", active: true, isToday: false, pointsEarned: 15 },
  { date: "2026-03-16", dayLabel: "MON", active: true, isToday: false, pointsEarned: 40 },
  { date: "2026-03-17", dayLabel: "TUE", active: true, isToday: false, pointsEarned: 75 },
  { date: "2026-03-18", dayLabel: "WED", active: true, isToday: false, pointsEarned: 50 },
  { date: "2026-03-19", dayLabel: "THU", active: true, isToday: true, pointsEarned: 35 },
];

export const INITIAL_30_DAY_STREAK: DayStreak[] = Array.from({ length: 30 }).map((_, i) => {
  const dayOffset = 29 - i;
  const isToday = dayOffset === 0;
  // 7-day active window at the end, scattered active days earlier
  const active = dayOffset < 7 || [8, 9, 11, 12, 14, 15, 18, 19, 21, 22, 25, 26].includes(dayOffset);
  return {
    date: `2026-03-${String(20 - dayOffset).padStart(2, "0")}`,
    dayLabel: `D${String(i + 1).padStart(2, "0")}`,
    active,
    isToday,
    pointsEarned: active ? (dayOffset < 7 ? 35 : 15) : 0,
  };
});

// Verifiable Certificates (Solid border) vs Skill Badges (Dashed border)
export const INITIAL_CREDENTIALS: CredentialItem[] = [
  {
    id: "cred-cert-1",
    code: "NGTA-CERT-2026-8910",
    title: "Selenium WebDriver & Framework Architecture",
    description: "Accredited completion of enterprise UI testing with Java, TestNG, and CI/CD pipelines.",
    type: "CERTIFICATE",
    isVerified: true,
    issuedAt: "2026-03-17",
    verificationId: "NGTA-CERT-course-1-2026-8910",
    tier: "ADVANCED",
    category: "OFFICIAL_ACCREDITATION",
    courseTitle: "Selenium WebDriver & Test Automation Framework Architecture",
  },
  {
    id: "cred-badge-1",
    code: "BADGE-XPATH-PRO",
    title: "XPath & Dynamic Locator Architect",
    description: "Constructed resilient dynamic locators utilizing ancestor, following-sibling, and regex axes.",
    type: "BADGE",
    isVerified: false,
    issuedAt: "2026-03-16",
    tier: "PROFICIENT",
    category: "SKILL_COMPETENCY",
  },
  {
    id: "cred-badge-2",
    code: "BADGE-THREADLOCAL-SAFE",
    title: "Thread-Safe Driver Teardown",
    description: "Implemented ThreadLocal<WebDriver> parallel test isolation without race condition leakage.",
    type: "BADGE",
    isVerified: false,
    issuedAt: "2026-03-18",
    tier: "ARCHITECTURE",
    category: "SKILL_COMPETENCY",
  },
  {
    id: "cred-badge-3",
    code: "BADGE-STREAK-7D",
    title: "7-Day Systems Discipline",
    description: "Maintained unbroken daily telemetry and learning cadence for 7 consecutive days.",
    type: "BADGE",
    isVerified: false,
    issuedAt: "2026-03-19",
    tier: "DISCIPLINE",
    category: "TELEMETRY_MILESTONE",
  },
];

// Leaderboard Standings
export const INITIAL_LEADERBOARD: Record<"WEEK" | "MONTH" | "ALL_TIME", LeaderboardEntry[]> = {
  WEEK: [
    {
      id: "lb-1",
      rank: 1,
      name: "Rohan Verma",
      handle: "@rohan.qa",
      cohort: "Selenium Automation (Cohort 26)",
      courseId: "course-1",
      points: 490,
      streakDays: 14,
      rankCode: "SDET-II",
    },
    {
      id: "lb-2",
      rank: 2,
      name: "Tanmay Sharma",
      handle: "@tanmay.sdet",
      cohort: "Selenium Automation (Cohort 26)",
      courseId: "course-1",
      points: 420,
      streakDays: 7,
      rankCode: "SDET-II",
      isCurrentUser: true,
    },
    {
      id: "lb-3",
      rank: 3,
      name: "Pooja Hegde",
      handle: "@pooja.test",
      cohort: "Playwright E2E (Cohort 14)",
      courseId: "course-2",
      points: 380,
      streakDays: 9,
      rankCode: "SDET-I",
    },
    {
      id: "lb-4",
      rank: 4,
      name: "Arjun Reddy",
      handle: "@arjun.eng",
      cohort: "Selenium Automation (Cohort 26)",
      courseId: "course-1",
      points: 340,
      streakDays: 5,
      rankCode: "SDET-I",
    },
    {
      id: "lb-5",
      rank: 5,
      name: "Deepika Patel",
      handle: "@deepika.arch",
      cohort: "Playwright E2E (Cohort 14)",
      courseId: "course-2",
      points: 290,
      streakDays: 12,
      rankCode: "SDET-I",
    },
  ],
  MONTH: [
    {
      id: "lb-m1",
      rank: 1,
      name: "Siddharth Rao",
      handle: "@siddharth.lead",
      cohort: "Selenium Automation (Cohort 26)",
      courseId: "course-1",
      points: 1240,
      streakDays: 28,
      rankCode: "LEAD",
    },
    {
      id: "lb-m2",
      rank: 2,
      name: "Rohan Verma",
      handle: "@rohan.qa",
      cohort: "Selenium Automation (Cohort 26)",
      courseId: "course-1",
      points: 1080,
      streakDays: 21,
      rankCode: "SDET-II",
    },
    {
      id: "lb-m3",
      rank: 3,
      name: "Tanmay Sharma",
      handle: "@tanmay.sdet",
      cohort: "Selenium Automation (Cohort 26)",
      courseId: "course-1",
      points: 860,
      streakDays: 19,
      rankCode: "SDET-II",
      isCurrentUser: true,
    },
    {
      id: "lb-m4",
      rank: 4,
      name: "Pooja Hegde",
      handle: "@pooja.test",
      cohort: "Playwright E2E (Cohort 14)",
      courseId: "course-2",
      points: 740,
      streakDays: 15,
      rankCode: "SDET-I",
    },
    {
      id: "lb-m5",
      rank: 5,
      name: "Manish Joshi",
      handle: "@manish.ci",
      cohort: "Playwright E2E (Cohort 14)",
      courseId: "course-2",
      points: 620,
      streakDays: 11,
      rankCode: "SDET-I",
    },
  ],
  ALL_TIME: [
    {
      id: "lb-a1",
      rank: 1,
      name: "Karan Johar",
      handle: "@karan.arch",
      cohort: "Selenium Automation (Cohort 26)",
      courseId: "course-1",
      points: 3450,
      streakDays: 68,
      rankCode: "LEAD",
    },
    {
      id: "lb-a2",
      rank: 2,
      name: "Siddharth Rao",
      handle: "@siddharth.lead",
      cohort: "Selenium Automation (Cohort 26)",
      courseId: "course-1",
      points: 2980,
      streakDays: 45,
      rankCode: "LEAD",
    },
    {
      id: "lb-a3",
      rank: 3,
      name: "Neha Gupta",
      handle: "@neha.sdet",
      cohort: "Playwright E2E (Cohort 14)",
      courseId: "course-2",
      points: 2150,
      streakDays: 32,
      rankCode: "SDET-II",
    },
    {
      id: "lb-a4",
      rank: 4,
      name: "Tanmay Sharma",
      handle: "@tanmay.sdet",
      cohort: "Selenium Automation (Cohort 26)",
      courseId: "course-1",
      points: 1840,
      streakDays: 24,
      rankCode: "SDET-II",
      isCurrentUser: true,
    },
    {
      id: "lb-a5",
      rank: 5,
      name: "Rohan Verma",
      handle: "@rohan.qa",
      cohort: "Selenium Automation (Cohort 26)",
      courseId: "course-1",
      points: 1620,
      streakDays: 21,
      rankCode: "SDET-II",
    },
  ],
};

// BRD Section 23: 30-Day SDET Challenge Tasks
export const INITIAL_CHALLENGE_TASKS: ChallengeTask[] = [
  { dayNumber: 1, title: "Install Java JDK 21 & Verify environment PATH", commandSnippet: "javac -version", isCompleted: true, pointsReward: 10 },
  { dayNumber: 2, title: "First program & JVM heap telemetry", commandSnippet: "java -XshowSettings:vm Main", isCompleted: true, pointsReward: 10 },
  { dayNumber: 3, title: "Variables, Primitive Types & Memory allocations", commandSnippet: "byte/short/int/long/float/double", isCompleted: true, pointsReward: 10 },
  { dayNumber: 4, title: "Control Flow, Branching & Loops", commandSnippet: "switch-case pattern matching", isCompleted: true, pointsReward: 10 },
  { dayNumber: 5, title: "OOP Architecture: Inheritance, Polymorphism, Abstract classes", commandSnippet: "abstract class BaseDriver", isCompleted: true, pointsReward: 15 },
  { dayNumber: 6, title: "Maven POM dependencies & TestNG XML Suite runner", commandSnippet: "mvn clean test -DsuiteXmlFile=testng.xml", isCompleted: true, pointsReward: 15 },
  { dayNumber: 7, title: "First Selenium WebDriver script with Chromium", commandSnippet: "WebDriver driver = new ChromeDriver();", isCompleted: true, pointsReward: 25 },
  { dayNumber: 8, title: "Locators: Advanced XPath axes & CSS Selectors", commandSnippet: "//div[contains(@class,'card')]//following-sibling::button", isCompleted: false, pointsReward: 15 },
  { dayNumber: 9, title: "Dynamic Synchronization: Explicit Waits vs Fluent Wait", commandSnippet: "new WebDriverWait(driver, Duration.ofSeconds(10))", isCompleted: false, pointsReward: 15 },
  { dayNumber: 10, title: "Handling Select dropdowns, Alerts & Modal dialogues", commandSnippet: "Select select = new Select(element);", isCompleted: false, pointsReward: 15 },
  { dayNumber: 11, title: "Multi-window & iFrame context switching", commandSnippet: "driver.switchTo().frame(\"login-frame\")", isCompleted: false, pointsReward: 20 },
  { dayNumber: 12, title: "Actions API: Hover, Drag and Drop, Key sequences", commandSnippet: "new Actions(driver).moveToElement(el).perform();", isCompleted: false, pointsReward: 20 },
  { dayNumber: 13, title: "JavaScript Executor: DOM manipulation & forced clicks", commandSnippet: "((JavascriptExecutor) driver).executeScript(...)", isCompleted: false, pointsReward: 20 },
  { dayNumber: 14, title: "Page Object Model (POM) foundation without PageFactory", commandSnippet: "public class LoginPage { private final WebDriver driver; }", isCompleted: false, pointsReward: 25 },
  { dayNumber: 15, title: "Page Factory pattern & CacheLookup annotations", commandSnippet: "@FindBy(id = \"login-btn\") private WebElement btn;", isCompleted: false, pointsReward: 25 },
  { dayNumber: 16, title: "Data-Driven Testing: Apache POI Excel sheet reader", commandSnippet: "WorkbookFactory.create(new File(\"testdata.xlsx\"))", isCompleted: false, pointsReward: 30 },
  { dayNumber: 17, title: "JSON & YAML configuration test payload parser", commandSnippet: "ObjectMapper mapper = new ObjectMapper();", isCompleted: false, pointsReward: 30 },
  { dayNumber: 18, title: "TestNG Listeners: ITestListener screenshot on failure", commandSnippet: "public void onTestFailure(ITestResult result)", isCompleted: false, pointsReward: 30 },
  { dayNumber: 19, title: "ThreadLocal<WebDriver> concurrent multi-browser setup", commandSnippet: "private static ThreadLocal<WebDriver> tlDriver = new ThreadLocal<>();", isCompleted: false, pointsReward: 40 },
  { dayNumber: 20, title: "Extent Reports & Allure Test report integration", commandSnippet: "ExtentTest test = extent.createTest(\"CheckoutTest\");", isCompleted: false, pointsReward: 35 },
  { dayNumber: 21, title: "Dockerized Selenium Grid: Hub and Chrome Node setup", commandSnippet: "docker-compose up -d selenium-hub chrome-node", isCompleted: false, pointsReward: 40 },
  { dayNumber: 22, title: "RemoteWebDriver configuration against Grid Hub", commandSnippet: "new RemoteWebDriver(new URL(\"http://hub:4444\"), caps);", isCompleted: false, pointsReward: 40 },
  { dayNumber: 23, title: "REST Assured integration for API precondition seeding", commandSnippet: "given().header(\"Authorization\", token).when().get(...)", isCompleted: false, pointsReward: 40 },
  { dayNumber: 24, title: "Database Assertion Layer: JDBC validation queries", commandSnippet: "ResultSet rs = stmt.executeQuery(\"SELECT status FROM orders\");", isCompleted: false, pointsReward: 40 },
  { dayNumber: 25, title: "GitHub Actions CI matrix pipeline authoring", commandSnippet: "runs-on: ubuntu-latest / matrix: [chrome, firefox]", isCompleted: false, pointsReward: 50 },
  { dayNumber: 26, title: "Headless execution optimization & memory profiling", commandSnippet: "options.addArguments(\"--headless=new\", \"--disable-gpu\");", isCompleted: false, pointsReward: 35 },
  { dayNumber: 27, title: "Flaky test auto-retry analyzer with IRetryAnalyzer", commandSnippet: "public boolean retry(ITestResult result)", isCompleted: false, pointsReward: 35 },
  { dayNumber: 28, title: "Parallel execution tuning in TestNG XML (parallel=methods)", commandSnippet: "<suite name=\"Suite\" parallel=\"methods\" thread-count=\"4\">", isCompleted: false, pointsReward: 45 },
  { dayNumber: 29, title: "Full Regression Suite execution & Failure triage", commandSnippet: "mvn test -Dtest=RegressionSuite", isCompleted: false, pointsReward: 50 },
  { dayNumber: 30, title: "Final Capstone Framework Defense & Architecture Audit", commandSnippet: "NGTA-CAPSTONE-SDET-PASSED [ACCREDITED]", isCompleted: false, pointsReward: 100 },
];
