"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

/** Small-screen conversion strip. Hidden on /book and while the menu is open via CSS. */
export function MobileActionBar() {
  const pathname = usePathname();
  if (pathname === "/book") return null;

  return (
    <nav className="mobile-action-bar" aria-label="Quick actions">
      <a href={site.phoneHref} className="mobile-action" aria-label={`Call ${site.phoneDisplay}`}>
        Call
      </a>
      <Link href="/book" className="mobile-action mobile-action-primary">
        Book
      </Link>
    </nav>
  );
}
