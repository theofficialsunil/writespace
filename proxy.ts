import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/blogs/new", "/settings", "/bookmarks"];
const authRoutes = ["/auth"];
const onboardingRoute = "/onboarding/username";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = await auth();

    const isLoggedIn = Boolean(session?.user);
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
    const isOnboardingRoute = pathname.startsWith(onboardingRoute);

    if (!isLoggedIn && isProtectedRoute) {
        return NextResponse.redirect(new URL("/auth", request.url));
    }

    if (isLoggedIn && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isOnboardingRoute) {
        return NextResponse.next();
    }

    if (isLoggedIn && !session?.user.username) {
        return NextResponse.redirect(new URL(onboardingRoute, request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/blogs/:path*",
        "/settings/:path*",
        "/bookmarks/:path*",
        "/auth",
        "/onboarding/username",
    ],
};