"use client";
import { useState, type ReactNode } from "react";
import {
  Layers,
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  PanelLeftClose,
  Menu,
  Bell,
  Folder,
  Search,
} from "lucide-react";
import {
  Button,
  Avatar,
  DropdownMenu,
  Dialog,
  Input,
  Badge,
  CommandMenu,
} from "@/components/ui/primitives";
import type { SectionProps } from "@/components/sections/shared";
export function ShellSection({
  content,
  variant,
  children,
  className = "",
  embedded = false,
}: SectionProps & { children?: ReactNode; embedded?: boolean }) {
  const ContentRoot = embedded ? "div" : "main";
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [panel, setPanel] = useState<string | null>(null);
  const [name, setName] = useState("Alex Morgan");
  const links = [
    ["Overview", LayoutDashboard, "#app-main"],
    ["Activity", BarChart3, "#app-activity"],
    ["People", Users, "#app-main"],
    ["Projects", Folder, "#app-main"],
  ] as const;
  return (
    <div
      className={
        "dashboard-shell shell-" +
        variant +
        (collapsed ? " is-collapsed" : "") +
        (mobile ? " mobile-open" : "") +
        " " +
        className
      }
    >
      <aside className="app-sidebar">
        <a href="#top" className="brand">
          <Layers size={24} />
          <span>{content.title}</span>
        </a>
        {["workspace", "dual", "sidebar"].includes(variant) && (
          <DropdownMenu
            label="Design workspace"
            items={["Design workspace", "Operations", "Personal"].map((label) => ({
              label,
              onSelect: () => setPanel(label),
            }))}
          />
        )}
        <div className="sidebar-label">WORKSPACE</div>
        <nav aria-label="Application navigation">
          {links.map(([label, Icon, href], i) => (
            <a
              className={i === 0 ? "active" : ""}
              key={label}
              href={href}
              onClick={() => setMobile(false)}
              title={label}
            >
              <Icon size={19} />
              <span>{label}</span>
              {i === 3 && <Badge>8</Badge>}
            </a>
          ))}
          <button onClick={() => setPanel("Settings")} title="Settings">
            <Settings size={19} />
            <span>Settings</span>
          </button>
        </nav>
        {variant === "dual" && (
          <div className="sidebar-projects">
            <span className="sidebar-label">YOUR TEAMS</span>
            <button onClick={() => setPanel("Product team")}>Product team</button>
            <button onClick={() => setPanel("Operations team")}>Operations team</button>
          </div>
        )}
        <div className="sidebar-account">
          <Avatar name={name} />
          <div>
            <strong>{name}</strong>
            <small>Workspace admin</small>
          </div>
        </div>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle sidebar"
            onClick={() => {
              setCollapsed(!collapsed);
              setMobile(!mobile);
            }}
          >
            {collapsed ? <Menu size={19} /> : <PanelLeftClose size={19} />}
          </Button>
          <span className="muted">Workspace / Overview</span>
          <div className="topbar-actions">
            <CommandMenu items={links.map(([label, , href]) => ({ label, href }))} />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              onClick={() => setPanel("Notifications")}
            >
              <Bell size={19} />
            </Button>
            <Avatar name={name} />
          </div>
        </header>
        {variant === "command" && (
          <div className="command-bar">
            <Search size={17} />
            <a href="#app-main">Fleet overview</a>
            <a href="#app-activity">Dispatch activity</a>
            <span>Local sample data</span>
          </div>
        )}
        <ContentRoot id="app-main" className="dashboard-content">
          {children}
        </ContentRoot>
      </div>
      {variant === "split" && (
        <aside className="app-context">
          <h3>Today at a glance</h3>
          <p>3 upcoming events</p>
          <p>2 requests to review</p>
          <Button variant="outline" onClick={() => setPanel("Daily briefing")}>
            Open briefing
          </Button>
        </aside>
      )}
      <Dialog
        title={panel || "Workspace"}
        description="Local workspace controls."
        open={!!panel}
        onOpenChange={(o) => {
          if (!o) setPanel(null);
        }}
      >
        {panel === "Settings" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPanel(null);
            }}
          >
            <label className="ui-field">
              Display name
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <Button type="submit">Save profile</Button>
          </form>
        ) : panel === "Notifications" ? (
          <ul className="notification-list">
            <li>Your weekly report is ready.</li>
            <li>Jordan completed the launch checklist.</li>
            <li>Two requests are waiting for review.</li>
          </ul>
        ) : (
          <p>
            {panel} is ready to explore. These sample workspaces demonstrate navigation without a
            backend.
          </p>
        )}
      </Dialog>
    </div>
  );
}
