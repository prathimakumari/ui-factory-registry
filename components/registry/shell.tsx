"use client";
import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Blocks,
  LayoutGrid,
  SlidersHorizontal,
  Component,
  Palette,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
const nav = [
  ["/registry", "All templates", LayoutGrid, "50"],
  ["/components", "Components", Component, "160"],
  ["/styles", "Visual styles", Sparkles, "20"],
  ["/themes", "Color themes", Palette, "24"],
  ["/motion", "Motion library", Blocks, "16"],
  ["/mobile", "Mobile designs", LayoutGrid, "12"],
] as const;
export function RegistryShell({
  children,
  title = "Registry",
  wide = false,
}: {
  children: ReactNode;
  title?: string;
  wide?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div
      className={
        "registry-app" + (wide ? " registry-wide" : "") + (open ? " registry-menu-open" : "")
      }
    >
      <aside className="registry-sidebar">
        <Link href="/" className="registry-logo">
          <span>
            <Blocks size={22} />
          </span>
          <strong>
            UI Factory<small>DESIGN REGISTRY</small>
          </strong>
        </Link>
        <div className="workspace-switch">
          <span className="workspace-avatar">UF</span>
          <div>
            Personal workspace<small>Local library</small>
          </div>
          <ChevronRight size={15} />
        </div>
        <div className="registry-nav-label">WORKSPACE</div>
        <nav aria-label="Registry navigation">
          {nav.map(([href, label, Icon, count]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={
                pathname === href || (pathname === "/" && href === "/registry") ? "active" : ""
              }
            >
              <Icon size={18} />
              <span>{label}</span>
              <small>{count}</small>
            </Link>
          ))}
        </nav>
        <div className="registry-nav-label">BUILD & LEARN</div>
        <nav aria-label="Tools and documentation">
          <Link className={pathname === "/playground" ? "active" : ""} href="/playground">
            <SlidersHorizontal size={18} />
            Playground<small className="new-label">NEW</small>
          </Link>
          <Link className={pathname === "/docs" ? "active" : ""} href="/docs">
            <BookOpen size={18} />
            Documentation
          </Link>
        </nav>
        <div className="sidebar-bottom">
          <div className="build-note">
            <span className="build-note-icon">
              <Blocks size={22} />
            </span>
            <strong>
              Your next project,
              <br />a head start.
            </strong>
            <p>
              Pick a foundation.
              <br />
              Make it your own.
            </p>
            <Link href="/playground">
              Open playground <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="registry-version">
            <span>UI Factory Registry</span>
            <small>v1.0.0</small>
          </div>
        </div>
      </aside>
      <div className="registry-main">
        <header className="registry-topbar">
          <button
            className="registry-menu-button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="registry-breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{title}</strong>
          </div>
          <div className="registry-top-actions">
            <Link href="/docs">
              Quick start <ArrowUpRight size={14} />
            </Link>
            <span className="top-divider" />
            <span className="local-indicator">Local registry</span>
            <span className="workspace-avatar">SK</span>
          </div>
        </header>
        <main id="main-content" className="registry-content">
          {children}
        </main>
        <footer className="registry-bottom">
          <span>Designed to be reused. Built to be yours.</span>
          <Link href="/docs">
            Agent integration <ArrowUpRight size={13} />
          </Link>
        </footer>
      </div>
    </div>
  );
}
