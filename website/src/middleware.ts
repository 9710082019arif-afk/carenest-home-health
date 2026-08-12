import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/data/site";

/**
 * Host-based indexing safeguard:
 * - Production hostname carenesthomehealth.in → allow normal robots meta
 * - Any other host (*.vercel.app, localhost, previews) → X-Robots-Tag: noindex
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const isProdHost =
    host === "carenesthomehealth.in" ||
    host === "www.carenesthomehealth.in";

  const res = NextResponse.next();

  if (!isProdHost) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  } else {
    // Prevent accidental www duplicate confusion via header clarity only;
    // canonical tags always point to apex SITE.url
    res.headers.set("X-Canonical-Site", SITE.url);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
