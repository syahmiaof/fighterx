"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

type SiteHeaderProps = {
  currentPage: "home" | "guidelines" | "login" | "register" | "my-club";
};

function BrandWordmark() {
  return (
    <Link className="brand" href="/#top" aria-label="FighterX homepage">
      <span className="brand-copy"><strong>FIGHTER<span>X</span></strong><small>SILAT ATHLETE PLATFORM</small></span>
    </Link>
  );
}

export function SiteHeader({ currentPage }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const headerInnerRef = useRef<HTMLDivElement>(null);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const header = headerInnerRef.current;
    if (!header) return;

    const updateIndicator = () => {
      const activeLink = header.querySelector<HTMLElement>(".header-nav > a[aria-current='page'], .header-actions > a[aria-current='page']");
      if (!activeLink || window.matchMedia("(max-width: 760px)").matches) {
        setIndicator((current) => current.width === 0 ? current : { left: current.left, width: 0 });
        return;
      }
      const headerBounds = header.getBoundingClientRect();
      const linkBounds = activeLink.getBoundingClientRect();
      setIndicator({ left: linkBounds.left - headerBounds.left, width: linkBounds.width });
    };

    updateIndicator();
    const observer = new ResizeObserver(updateIndicator);
    observer.observe(header);
    window.addEventListener("resize", updateIndicator);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [currentPage]);

  return (
    <header className="site-header" id={currentPage === "home" ? "top" : undefined}>
      <div className="header-inner" ref={headerInnerRef}>
        <BrandWordmark />
        <nav className="header-nav" aria-label="Primary navigation">
          <Link href="/#top" aria-current={currentPage === "home" ? "page" : undefined}>Homepage</Link>
          <Link href="/guidelines" aria-current={currentPage === "guidelines" ? "page" : undefined}>Guidelines</Link>
        </nav>
        <div className="header-actions">
          <Link href="/login" className="signin-link" aria-current={currentPage === "login" ? "page" : undefined}>Sign In</Link>
          <Link href="/register-club" className="button button-primary button-small" aria-current={currentPage === "register" ? "page" : undefined}>Register Club <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <nav id="mobile-navigation" className={`mobile-menu${menuOpen ? " is-open" : ""}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
          <Link href="/#top" aria-current={currentPage === "home" ? "page" : undefined} onClick={closeMenu}>Homepage</Link>
          <Link href="/guidelines" aria-current={currentPage === "guidelines" ? "page" : undefined} onClick={closeMenu}>Guidelines</Link>
          <Link href="/login" aria-current={currentPage === "login" ? "page" : undefined} onClick={closeMenu}>Sign In</Link>
          <Link href="/register-club" className="mobile-menu-register" aria-current={currentPage === "register" ? "page" : undefined} onClick={closeMenu}>Register Club <ArrowRight size={16} aria-hidden="true" /></Link>
        </nav>
        <span className="header-active-indicator" aria-hidden="true" style={{ left: indicator.left, width: indicator.width }} />
      </div>
    </header>
  );
}
