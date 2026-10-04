"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { NavItem, NavLink } from "@/config/site";
import { Icon } from "@/components/ui/Icon";

function isCurrent(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

type HeaderProps = { siteName: string; nav: NavItem[] };

/**
 * Site header with an accessible disclosure-style menu:
 * - dropdowns are real <button>s with aria-expanded (Enter/Space toggles, Escape closes);
 * - the mobile menu is toggled by a button and closes on Escape, overlay click or navigation;
 * - on desktop, dropdowns also open on hover via CSS.
 */
export function Header({ siteName, nav }: HeaderProps) {
  const pathname = usePathname();
  const navId = useId();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close menus after navigating (adjusting state during render, as React recommends).
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setOpenDropdown(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close an open dropdown when clicking anywhere outside the navigation.
  useEffect(() => {
    if (!openDropdown) return;
    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openDropdown]);

  // Escape closes the innermost open menu and returns focus to the button that opened it.
  useEffect(() => {
    if (!openDropdown && !mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openDropdown) {
        const toggle = navRef.current?.querySelector<HTMLButtonElement>(`[data-dropdown="${openDropdown}"]`);
        setOpenDropdown(null);
        toggle?.focus();
      } else {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openDropdown, mobileOpen]);

  const classes = ["site-header"];
  if (pathname === "/") classes.push("transparent");
  if (scrolled) classes.push("scrolled");
  if (mobileOpen) classes.push("nav-open");

  return (
    <header className={classes.join(" ")}>
      <div className="container-xl d-flex align-items-center justify-content-between">
        <Link href="/" className="logo">
          <Icon name="buildings" />
          <span>{siteName}</span>
        </Link>

        <nav ref={navRef} id={navId} className="navmenu" aria-label="Main">
          <ul>
            {nav.map((item) =>
              "children" in item ? (
                <DropdownItem
                  key={item.label}
                  label={item.label}
                  links={item.children}
                  pathname={pathname}
                  open={openDropdown === item.label}
                  onToggle={() => setOpenDropdown((current) => (current === item.label ? null : item.label))}
                  onBlurOutside={() => setOpenDropdown((current) => (current === item.label ? null : current))}
                />
              ) : (
                <li key={item.href}>
                  <NavAnchor link={item} pathname={pathname} />
                </li>
              ),
            )}
          </ul>
        </nav>

        {mobileOpen && (
          <button
            type="button"
            className="nav-overlay"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setMobileOpen(false)}
          />
        )}
        <button
          ref={toggleRef}
          type="button"
          className="mobile-toggle"
          aria-controls={navId}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <Icon name={mobileOpen ? "x-lg" : "list"} />
        </button>
      </div>
    </header>
  );
}

function NavAnchor({ link, pathname }: { link: NavLink; pathname: string }) {
  const current = isCurrent(link.href, pathname);
  return (
    <Link
      href={link.href}
      className={current ? "active" : undefined}
      aria-current={pathname === link.href ? "page" : undefined}
    >
      {link.label}
    </Link>
  );
}

type DropdownItemProps = {
  label: string;
  links: NavLink[];
  pathname: string;
  open: boolean;
  onToggle: () => void;
  onBlurOutside: () => void;
};

function DropdownItem({ label, links, pathname, open, onToggle, onBlurOutside }: DropdownItemProps) {
  const menuId = useId();
  const active = links.some((link) => isCurrent(link.href, pathname));

  return (
    <li
      className={`dropdown${open ? " open" : ""}`}
      onBlur={(event) => {
        // Close when keyboard focus moves outside this dropdown.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onBlurOutside();
      }}
    >
      <button
        type="button"
        className={`dropdown-toggle${active ? " active" : ""}`}
        aria-expanded={open}
        aria-controls={menuId}
        data-dropdown={label}
        onClick={onToggle}
      >
        <span>{label}</span> <Icon name="chevron-down" />
      </button>
      <ul id={menuId}>
        {links.map((link) => (
          <li key={link.href}>
            <NavAnchor link={link} pathname={pathname} />
          </li>
        ))}
      </ul>
    </li>
  );
}
