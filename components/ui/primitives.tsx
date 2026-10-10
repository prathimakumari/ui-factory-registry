"use client";
import * as React from "react";
import type { SectionContent } from "@/registry/schema";
import {
  Dialog as RDialog,
  Popover as RPopover,
  Tooltip as RTooltip,
  Tabs as RTabs,
  Accordion as RAccordion,
  DropdownMenu as RMenu,
  Switch as RSwitch,
} from "radix-ui";
import { X, Check, ChevronDown, Search, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeVariables } from "./theme-scope";
import { Button } from "./button";
export { Button } from "./button";
export function Link({ className, ...props }: React.ComponentProps<"a">) {
  return <a className={cn("ui-link", className)} {...props} />;
}
export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn("ui-input", className)} {...props} />;
}
export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn("ui-input", className)} {...props} />;
}
export function Label(props: React.ComponentProps<"label">) {
  return <label className="ui-label" {...props} />;
}
export function Select({
  label,
  options,
  className,
  id: providedId,
  ...props
}: React.ComponentProps<"select"> & {
  label: string;
  options: { value: string; label: string }[];
}) {
  const generatedId = React.useId();
  const id = providedId || generatedId;
  return (
    <div className={cn("ui-field", className)}>
      <label htmlFor={id}>{label}</label>
      <select id={id} className="ui-input" {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
export function Checkbox({ label, ...props }: React.ComponentProps<"input"> & { label: string }) {
  return (
    <label className="check-label">
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}
export function Radio({ label, ...props }: React.ComponentProps<"input"> & { label: string }) {
  return (
    <label className="check-label">
      <input type="radio" {...props} />
      <span>{label}</span>
    </label>
  );
}
export function Switch({
  label,
  id: providedId,
  ...props
}: React.ComponentProps<typeof RSwitch.Root> & { label: string }) {
  const generatedId = React.useId();
  const id = providedId || generatedId;
  return (
    <div className="check-label">
      <RSwitch.Root id={id} className="ui-switch" {...props}>
        <RSwitch.Thumb className="switch-thumb" />
      </RSwitch.Root>
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
export function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("ui-badge", className)} {...props} />;
}
export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span role="img" aria-label={name} className={cn("ui-avatar", className)}>
      {name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
export function Card({
  variant = "plain",
  className,
  ...props
}: React.ComponentProps<"article"> & { variant?: string }) {
  return <article className={cn("ui-card", "card-" + variant, className)} {...props} />;
}
export function CardSection({
  content,
  variant,
  className,
}: {
  content: SectionContent;
  variant: string;
  className?: string;
}) {
  return (
    <Card variant={variant} className={className}>
      <span className="eyebrow">{content.eyebrow}</span>
      <h3>{content.title}</h3>
      <p>{content.description}</p>
    </Card>
  );
}
export function Separator() {
  return <hr className="ui-separator" />;
}
export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const variables = useThemeVariables();
  return (
    <RTooltip.Provider delayDuration={200}>
      <RTooltip.Root>
        <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
        <RTooltip.Portal>
          <RTooltip.Content
            className="ui-tooltip"
            style={variables}
            sideOffset={8}
            collisionPadding={12}
          >
            {label}
            <RTooltip.Arrow />
          </RTooltip.Content>
        </RTooltip.Portal>
      </RTooltip.Root>
    </RTooltip.Provider>
  );
}
export function Popover({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  const variables = useThemeVariables();
  return (
    <RPopover.Root>
      <RPopover.Trigger asChild>{trigger}</RPopover.Trigger>
      <RPopover.Portal>
        <RPopover.Content
          className="ui-popover"
          style={variables}
          sideOffset={8}
          collisionPadding={12}
        >
          {children}
          <RPopover.Close asChild>
            <Button variant="ghost" size="sm">
              Close
            </Button>
          </RPopover.Close>
        </RPopover.Content>
      </RPopover.Portal>
    </RPopover.Root>
  );
}
export function Dialog({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  drawer = false,
}: {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  drawer?: boolean;
}) {
  const variables = useThemeVariables();
  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <RDialog.Trigger asChild>{trigger}</RDialog.Trigger>}
      <RDialog.Portal>
        <RDialog.Overlay className="dialog-overlay" />
        <RDialog.Content style={variables} className={cn("ui-dialog", drawer && "ui-drawer")}>
          <RDialog.Title>{title}</RDialog.Title>
          <RDialog.Description>{description || "Complete the details below."}</RDialog.Description>
          {children}
          <RDialog.Close asChild>
            <Button className="dialog-close" variant="ghost" size="icon" aria-label="Close dialog">
              <X size={18} />
            </Button>
          </RDialog.Close>
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
export function Drawer(props: React.ComponentProps<typeof Dialog>) {
  return <Dialog {...props} drawer />;
}
export function Accordion({
  items,
  defaultValue,
}: {
  items: { title: string; content: React.ReactNode }[];
  defaultValue?: string;
}) {
  return (
    <RAccordion.Root type="single" collapsible defaultValue={defaultValue} className="ui-accordion">
      {items.map((item, i) => (
        <RAccordion.Item value={String(i)} key={i}>
          <RAccordion.Header>
            <RAccordion.Trigger>
              {item.title}
              <ChevronDown size={17} />
            </RAccordion.Trigger>
          </RAccordion.Header>
          <RAccordion.Content>
            <div>{item.content}</div>
          </RAccordion.Content>
        </RAccordion.Item>
      ))}
    </RAccordion.Root>
  );
}
export function Tabs({
  items,
  defaultValue,
  onValueChange,
}: {
  items: { id: string; label: string; content: React.ReactNode }[];
  defaultValue?: string;
  onValueChange?: (v: string) => void;
}) {
  return (
    <RTabs.Root defaultValue={defaultValue || items[0]?.id} onValueChange={onValueChange}>
      <RTabs.List className="ui-tabs" aria-label="Content views">
        {items.map((i) => (
          <RTabs.Trigger key={i.id} value={i.id}>
            {i.label}
          </RTabs.Trigger>
        ))}
      </RTabs.List>
      {items.map((i) => (
        <RTabs.Content className="tab-panel" key={i.id} value={i.id}>
          {i.content}
        </RTabs.Content>
      ))}
    </RTabs.Root>
  );
}
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumbs">
        {items.map((i, n) => (
          <li key={n}>
            {i.href ? (
              <a href={i.href}>{i.label}</a>
            ) : (
              <span aria-current={n === items.length - 1 ? "page" : undefined}>{i.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (p: number) => void;
}) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <span>
        Page {page} of {Math.max(1, pages)}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("ui-skeleton", className)} />;
}
export function Progress({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress-wrap">
      <div className="spread">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <progress max={100} value={Math.min(100, Math.max(0, value))} aria-label={label} />
    </div>
  );
}
export function Alert({
  title,
  children,
  variant = "info",
}: {
  title: string;
  children?: React.ReactNode;
  variant?: "info" | "error" | "success";
}) {
  return (
    <div role={variant === "error" ? "alert" : "status"} className={"ui-alert alert-" + variant}>
      <strong>{title}</strong>
      {children && <p>{children}</p>}
    </div>
  );
}
export function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [message, onDismiss]);
  return (
    <div role="status" className="ui-toast">
      <Check size={18} />
      {message}
      <Button variant="ghost" size="icon" aria-label="Dismiss notification" onClick={onDismiss}>
        <X size={16} />
      </Button>
    </div>
  );
}
export function DropdownMenu({
  label,
  items,
}: {
  label: string;
  items: { label: string; onSelect: () => void; disabled?: boolean }[];
}) {
  const variables = useThemeVariables();
  return (
    <RMenu.Root>
      <RMenu.Trigger asChild>
        <Button variant="outline">
          {label}
          <ChevronDown size={15} />
        </Button>
      </RMenu.Trigger>
      <RMenu.Portal>
        <RMenu.Content className="ui-menu" style={variables} sideOffset={6} collisionPadding={12}>
          {items.map((i, n) => (
            <RMenu.Item key={n} disabled={i.disabled} onSelect={i.onSelect}>
              {i.label}
            </RMenu.Item>
          ))}
        </RMenu.Content>
      </RMenu.Portal>
    </RMenu.Root>
  );
}
export function CommandMenu({ items }: { items: { label: string; href: string }[] }) {
  const [q, setQ] = React.useState("");
  return (
    <Dialog
      title="Go to…"
      trigger={
        <Button variant="outline">
          <Search size={16} />
          Quick navigation
        </Button>
      }
    >
      <Input
        aria-label="Search commands"
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <nav className="command-results" aria-label="Command results">
        {items
          .filter((i) => i.label.toLowerCase().includes(q.toLowerCase()))
          .map((i) => (
            <a key={i.href} href={i.href}>
              {i.label}
            </a>
          ))}
        {!items.some((i) => i.label.toLowerCase().includes(q.toLowerCase())) && (
          <p>No matching commands.</p>
        )}
      </nav>
    </Dialog>
  );
}
export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactElement<{
    id?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
  }>;
}) {
  const generatedId = React.useId();
  const id = children.props.id || generatedId;
  const describedBy =
    [children.props["aria-describedby"], error ? id + "-error" : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div className="ui-field">
      <Label htmlFor={id}>{label}</Label>
      {React.cloneElement(children, {
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : children.props["aria-invalid"],
      })}
      {error && (
        <span role="alert" className="field-error" id={id + "-error"}>
          {error}
        </span>
      )}
    </div>
  );
}
export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="loading-state">
      <LoaderCircle className="loading-spinner" size={22} />
      <span>{label}</span>
    </div>
  );
}
export function EmptyState({
  title = "No results",
  description = "Try a different search or clear your filters.",
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <Search size={28} />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
