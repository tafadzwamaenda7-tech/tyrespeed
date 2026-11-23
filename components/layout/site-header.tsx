"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { site } from "@/lib/site";
import { useApp } from "@/components/providers/app-provider";
import { SiteLogo } from "@/components/layout/site-logo";

export function SiteHeader() {
  const pathname = usePathname();
  const { openPalette, openDrawer, quoteCount } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shortcutHint, setShortcutHint] = useState("Search");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const platform = navigator.platform.toLowerCase();
    setShortcutHint(platform.includes("mac") ? "⌘K" : "Ctrl K");
  }, []);

  const closeMenu = useCallback((restoreFocus = false) => {
    setMenuOpen(false);
    if (restoreFocus) menuButtonRef.current?.focus();
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.menuOpen = "true";
    closeButtonRef.current?.focus();

    const desktop = window.matchMedia("(min-width: 901px)");
    const onResize = () => {
      if (desktop.matches) setMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu(true);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = sheetRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    desktop.addEventListener("change", onResize);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      delete document.body.dataset.menuOpen;
      desktop.removeEventListener("change", onResize);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  return (
    <>
      <header className="main-nav">
        <div className="wrap">
          <Link href="/" className="brand-link" aria-label="tyrespeed home">
            <SiteLogo priority />
          </Link>

          <nav className="nav-links" aria-label="Main navigation">
            {site.navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href} className="nav-link" aria-current={active ? "page" : undefined}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="search-trigger"
              onClick={openPalette}
              aria-label={`Search ${shortcutHint}, size, service or SKU, opens command palette`}
            >
              <Search size={16} aria-hidden="true" />
              <span>Search</span>{" "}
              <kbd>{shortcutHint}</kbd>
            </button>
            <Link href="/book" className="btn btn-accent book-entry">Book</Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="nav-menu-button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => (menuOpen ? closeMenu(true) : setMenuOpen(true))}
            >
              {menuOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`menu-layer${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen ? true : undefined}
      >
        <button
          type="button"
          className="menu-backdrop"
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => closeMenu(true)}
        />
        <div
          id="mobile-navigation"
          className="menu-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          ref={sheetRef}
        >
          <div className="menu-sheet-head">
            <SiteLogo />
            <div className="menu-head-actions">
              <button
                type="button"
                className="menu-search-button"
                onClick={() => { setMenuOpen(false); openPalette(); }}
                aria-label="Search size, service or SKU, opens command palette"
              >
                <Search size={18} aria-hidden="true" />
              </button>
              <button
                ref={closeButtonRef}
                type="button"
                className="menu-sheet-close"
                onClick={() => closeMenu(true)}
                aria-label="Close menu"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          <nav className="menu-nav" aria-label="Mobile main navigation">
            {site.navigation.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`menu-nav-link${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="menu-sheet-foot">
            <div className="menu-utility-grid">
              <a href={site.phoneHref} className="menu-utility-link" data-track="call">
                <span className="menu-utility-label">Call</span>
                <span className="menu-utility-value">{site.phoneDisplay}</span>
              </a>
              <a href={site.whatsappHref} target="_blank" rel="noreferrer" className="menu-utility-link" data-track="whatsapp">
                <span className="menu-utility-label">WhatsApp</span>
                <span className="menu-utility-value">{site.whatsappDisplay}</span>
              </a>
            </div>
            <div className="menu-actions">
              <button
                type="button"
                className="btn btn-outline btn-block"
                onClick={() => { setMenuOpen(false); openDrawer(); }}
                aria-label={`Open quote, ${quoteCount} ${quoteCount === 1 ? "item" : "items"}`}
              >
                Quote <span className="data" aria-live="polite">{quoteCount}</span>
              </button>
              <Link href="/book" className="btn btn-accent btn-block" onClick={() => setMenuOpen(false)}>
                Book a slot
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
