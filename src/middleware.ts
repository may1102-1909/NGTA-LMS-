import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const VALID_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "INSTRUCTOR",
  "CONTENT_MANAGER",
  "SUPPORT_STAFF",
  "LEARNER",
  "GUEST",
];

function getDashboardForRole(role: string): string {
  switch (role.toUpperCase()) {
    case "SUPER_ADMIN":
      return "/dashboard/super-admin";
    case "ADMIN":
      return "/dashboard/admin";
    case "INSTRUCTOR":
      return "/dashboard/instructor";
    case "CONTENT_MANAGER":
      return "/dashboard/content";
    case "SUPPORT_STAFF":
      return "/dashboard/support";
    case "LEARNER":
    case "GUEST":
    default:
      return "/dashboard/learner";
  }
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const pathname = request.nextUrl.pathname;

  // Only intercept /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check cookie role first, fallback to user metadata or LEARNER
    const cookieRole = request.cookies.get("ngta_user_role")?.value?.toUpperCase();
    const metaRole = String(
      user?.user_metadata?.role || user?.app_metadata?.role || ""
    ).toUpperCase();

    const currentRole = cookieRole || metaRole || "LEARNER";

    // 1. Root /dashboard access: Redirect dynamically to role-specific dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      const destination = getDashboardForRole(currentRole);
      return NextResponse.redirect(new URL(destination, request.url));
    }

    // 2. Strict Role-Based RBAC Permissions for each dashboard
    if (pathname.startsWith("/dashboard/super-admin")) {
      if (currentRole !== "SUPER_ADMIN") {
        const fallback = getDashboardForRole(currentRole);
        return NextResponse.redirect(new URL(fallback, request.url));
      }
    } else if (pathname.startsWith("/dashboard/admin")) {
      if (currentRole !== "ADMIN" && currentRole !== "SUPER_ADMIN") {
        const fallback = getDashboardForRole(currentRole);
        return NextResponse.redirect(new URL(fallback, request.url));
      }
    } else if (pathname.startsWith("/dashboard/instructor")) {
      if (
        currentRole !== "INSTRUCTOR" &&
        currentRole !== "ADMIN" &&
        currentRole !== "SUPER_ADMIN"
      ) {
        const fallback = getDashboardForRole(currentRole);
        return NextResponse.redirect(new URL(fallback, request.url));
      }
    } else if (pathname.startsWith("/dashboard/content")) {
      if (
        currentRole !== "CONTENT_MANAGER" &&
        currentRole !== "ADMIN" &&
        currentRole !== "SUPER_ADMIN"
      ) {
        const fallback = getDashboardForRole(currentRole);
        return NextResponse.redirect(new URL(fallback, request.url));
      }
    } else if (pathname.startsWith("/dashboard/support")) {
      if (
        currentRole !== "SUPPORT_STAFF" &&
        currentRole !== "ADMIN" &&
        currentRole !== "SUPER_ADMIN"
      ) {
        const fallback = getDashboardForRole(currentRole);
        return NextResponse.redirect(new URL(fallback, request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
  ],
};
