"use client";
import { useState, useId } from "react";
import { ArrowDownUp, Download } from "lucide-react";
import { Button, Input, Select, Pagination, EmptyState, Card } from "@/components/ui/primitives";
export type Row = Record<string, string | number>;
export function downloadText(name: string, content: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function DataTable({
  title,
  rows,
  columns,
  pageSize = 5,
}: {
  title: string;
  rows: Row[];
  columns: { key: string; label: string }[];
  pageSize?: number;
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(columns[0].key);
  const [desc, setDesc] = useState(false);
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const filtered = rows
    .filter(
      (r) =>
        Object.values(r).join(" ").toLowerCase().includes(q.toLowerCase()) &&
        (status === "All" || r.status === status),
    )
    .sort((a, b) => {
      const av = a[sort],
        bv = b[sort];
      const n =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return desc ? -n : n;
    });
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages);
  const statuses = [
    "All",
    ...new Set(rows.map((r) => r.status).filter((s): s is string => typeof s === "string")),
  ];
  const exportCsv = () => {
    const cell = (v: unknown) =>
      '"' +
      String(v ?? "")
        .replace(/^[=+\-@]/, "'$&")
        .replaceAll('"', '""') +
      '"';
    downloadText(
      "table-export.csv",
      [
        columns.map((c) => cell(c.label)).join(","),
        ...filtered.map((r) => columns.map((c) => cell(r[c.key])).join(",")),
      ].join("\r\n"),
      "text/csv;charset=utf-8",
    );
  };
  return (
    <Card className="data-panel">
      <div className="spread">
        <h3>{title}</h3>
        <Button size="sm" variant="outline" onClick={exportCsv}>
          <Download size={14} />
          Export CSV
        </Button>
      </div>
      <div className="table-controls">
        <Input
          aria-label={"Search " + title}
          placeholder="Search records…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
        {statuses.length > 1 && (
          <Select
            label="Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            options={statuses.map((s) => ({ value: s, label: s }))}
          />
        )}
      </div>
      <div className="table-scroll">
        <table>
          <caption className="sr-only">
            {title}, {filtered.length} matching records
          </caption>
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  aria-sort={sort === c.key ? (desc ? "descending" : "ascending") : "none"}
                >
                  <button
                    onClick={() => {
                      if (sort === c.key) setDesc(!desc);
                      else {
                        setSort(c.key);
                        setDesc(false);
                      }
                    }}
                  >
                    {c.label}
                    <ArrowDownUp size={13} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice((current - 1) * pageSize, current * pageSize).map((row, i) => (
              <tr key={String(row.id || i)}>
                {columns.map((c) => (
                  <td key={c.key}>
                    {c.key === "status" ? (
                      <span
                        className={
                          "status-pill status-" +
                          String(row[c.key]).toLowerCase().replaceAll(" ", "-")
                        }
                      >
                        {row[c.key]}
                      </span>
                    ) : (
                      row[c.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filtered.length && <EmptyState />}
      <Pagination page={current} pages={pages} onChange={setPage} />
    </Card>
  );
}
export function Chart({
  title,
  values = [32, 46, 41, 62, 58, 74, 69, 86, 80, 95, 88, 108],
  labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  type = "line",
}: {
  title: string;
  values?: number[];
  labels?: string[];
  type?: "line" | "bar" | "donut";
}) {
  const uid = useId().replaceAll(":", "");
  const max = Math.max(...values, 1);
  const pts = values
    .map((v, i) => 32 + i * (536 / Math.max(values.length - 1, 1)) + "," + (205 - (v / max) * 160))
    .join(" ");
  return (
    <div className={"chart chart-" + type}>
      <svg viewBox="0 0 600 245" role="img" aria-labelledby={uid}>
        <title id={uid}>
          {title + ": " + values.map((v, i) => (labels[i] || i + 1) + " " + v).join(", ")}
        </title>
        {type === "donut" ? (
          <g transform="translate(300 115) rotate(-90)">
            <circle r="80" fill="none" stroke="var(--muted)" strokeWidth="32" />
            {values.slice(0, 4).map((v, i) => {
              const total = values.slice(0, 4).reduce((a, b) => a + b, 0);
              return (
                <circle
                  key={i}
                  r="80"
                  fill="none"
                  stroke={"var(--chart-" + (i + 1) + ")"}
                  strokeWidth="32"
                  strokeDasharray={(v / total) * 502 + " 502"}
                  strokeDashoffset={(-values.slice(0, i).reduce((a, b) => a + b, 0) / total) * 502}
                />
              );
            })}
          </g>
        ) : (
          <>
            {[45, 85, 125, 165, 205].map((y) => (
              <line
                key={y}
                x1="32"
                y1={y}
                x2="568"
                y2={y}
                stroke="var(--border)"
                opacity=".3"
                strokeDasharray="4 5"
              />
            ))}
            {type === "line" ? (
              <>
                <polygon points={"32,205 " + pts + " 568,205"} fill="var(--primary)" opacity=".1" />
                <polyline
                  points={pts}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ) : (
              values.map((v, i) => (
                <rect
                  key={i}
                  x={32 + i * (536 / values.length)}
                  y={205 - (v / max) * 160}
                  width={Math.max(8, 536 / values.length - 12)}
                  height={(v / max) * 160}
                  rx="4"
                  fill={"var(--chart-" + ((i % 2) + 1) + ")"}
                />
              ))
            )}
            {labels.slice(0, values.length).map((l, i) =>
              i % 2 === 0 ? (
                <text
                  key={i}
                  x={32 + (i * 536) / Math.max(values.length - 1, 1)}
                  y="232"
                  fill="var(--muted-foreground)"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {l}
                </text>
              ) : null,
            )}
          </>
        )}
      </svg>
      <details>
        <summary>View chart data</summary>
        <table>
          <caption>{title}</caption>
          <tbody>
            {values.map((v, i) => (
              <tr key={i}>
                <th>{labels[i] || "Series " + (i + 1)}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
export function MetricCards({
  items,
}: {
  items: { label: string; value: string; change: string }[];
}) {
  return (
    <div className="metric-cards">
      {items.map((i) => (
        <Card key={i.label} variant="metric">
          <span className="muted">{i.label}</span>
          <strong>{i.value}</strong>
          <small>{i.change}</small>
        </Card>
      ))}
    </div>
  );
}
