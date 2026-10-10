"use client";
import { useState, createContext, useContext } from "react";
import { Plus, Clock, Truck, Building2, Download } from "lucide-react";
import {
  Button,
  Card,
  Input,
  Select,
  Badge,
  Avatar,
  Dialog,
  Alert,
  Progress,
  Switch,
  EmptyState,
} from "@/components/ui/primitives";
import { DataTable, Chart, MetricCards, downloadText, type Row } from "./data";
import { ReorderList } from "@/components/motion/primitives";
import type { SectionProps } from "@/components/sections/shared";
const ReportPeriod = createContext(30);
const people = [
  "Alex Morgan",
  "Jordan Lee",
  "Sam Rivera",
  "Taylor Reed",
  "Jamie Parker",
  "Casey Chen",
  "Riley Brooks",
  "Avery Kim",
];
const commonMetrics = [
  { label: "Total revenue", value: "$48,295", change: "+12.8% from last month" },
  { label: "Active customers", value: "2,420", change: "+8.2% from last month" },
  { label: "Projects in progress", value: "32", change: "6 launching this week" },
  { label: "Completion rate", value: "94.2%", change: "+3.4% from last month" },
];
const activity = [
  ["Jordan Lee", "Completed the launch checklist", "12 minutes ago"],
  ["Sam Rivera", "Added feedback to the dashboard review", "38 minutes ago"],
  ["Taylor Reed", "Updated the project timeline", "1 hour ago"],
  ["Alex Morgan", "Invited Casey to the workspace", "2 hours ago"],
];
function Activity() {
  return (
    <Card>
      <h3>Recent activity</h3>
      <ol className="activity-list">
        {activity.map(([name, event, time]) => (
          <li key={name}>
            <Avatar name={name} />
            <div>
              <strong>{name}</strong>
              <p>{event}</p>
              <small>{time}</small>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
function ChartPanel({
  title = "Revenue over time",
  type = "line",
  factor = 1,
}: {
  title?: string;
  type?: "line" | "bar" | "donut";
  factor?: number;
}) {
  const days = useContext(ReportPeriod);
  return (
    <Card>
      <div className="spread">
        <h3>{title}</h3>
        <Badge>Sample data</Badge>
      </div>
      <Chart
        title={title}
        type={type}
        values={[32, 46, 41, 62, 58, 74, 69, 86, 80, 95, 88, 108].map((v) =>
          Math.round((v * factor * days) / 30),
        )}
      />
    </Card>
  );
}
function Overview() {
  return (
    <>
      <MetricCards items={commonMetrics} />
      <div className="dashboard-grid">
        <ChartPanel />
        <Card>
          <h3>Project health</h3>
          <Progress value={82} label="Website redesign" />
          <Progress value={64} label="Mobile experience" />
          <Progress value={91} label="Design system" />
          <Progress value={38} label="Customer portal" />
        </Card>
      </div>
      <DataTable
        title="Recent projects"
        rows={people.map((name, i) => ({
          id: i,
          name: [
            "Website redesign",
            "Mobile onboarding",
            "Design system",
            "Customer portal",
            "Analytics update",
            "Billing flow",
            "Documentation",
            "Brand refresh",
          ][i],
          owner: name,
          status: i % 3 === 0 ? "In progress" : i % 3 === 1 ? "Review" : "Completed",
          due: "Oct " + (12 + i),
        }))}
        columns={[
          { key: "name", label: "Project" },
          { key: "owner", label: "Owner" },
          { key: "status", label: "Status" },
          { key: "due", label: "Due date" },
        ]}
      />
    </>
  );
}
function Analytics() {
  const [channel, setChannel] = useState("All channels");
  const factor = channel === "Organic" ? 0.7 : channel === "Referral" ? 0.3 : 1;
  return (
    <>
      <div className="analytics-summary">
        <div>
          <span className="eyebrow">AUDIENCE GROWTH</span>
          <strong>{Math.round(128420 * factor).toLocaleString("en-US")}</strong>
          <p>Visitors in the selected period</p>
        </div>
        <Select
          label="Channel"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          options={["All channels", "Organic", "Referral"].map((x) => ({ value: x, label: x }))}
        />
      </div>
      <div className="dashboard-grid">
        <ChartPanel title="Visitor trends" factor={factor} />
        <ChartPanel title="Traffic sources" type="donut" factor={factor} />
      </div>
      <div className="dashboard-grid equal">
        <Card>
          <h3>Conversion funnel</h3>
          {[
            ["Visitors", 100],
            ["Product views", 72],
            ["Signups", 28],
            ["Activated", 18],
          ].map(([label, value]) => (
            <Progress key={label} label={String(label)} value={Number(value)} />
          ))}
        </Card>
        <DataTable
          title="Top pages"
          rows={[
            { page: "/", views: Math.round(42800 * factor), conversion: "4.8%" },
            { page: "/product", views: Math.round(18640 * factor), conversion: "6.2%" },
            { page: "/pricing", views: Math.round(12920 * factor), conversion: "8.1%" },
            { page: "/blog", views: Math.round(8400 * factor), conversion: "2.4%" },
          ]}
          columns={[
            { key: "page", label: "Page" },
            { key: "views", label: "Views" },
            { key: "conversion", label: "Conversion" },
          ]}
        />
      </div>
    </>
  );
}
function Pipeline() {
  const [deals, setDeals] = useState([
    { name: "Northstar Studio", value: 12400, stage: "Lead", owner: "Alex Morgan" },
    { name: "Fieldwork Inc.", value: 8600, stage: "Qualified", owner: "Jordan Lee" },
    { name: "Forma Design", value: 24000, stage: "Proposal", owner: "Sam Rivera" },
    { name: "Layer Labs", value: 16800, stage: "Won", owner: "Taylor Reed" },
    { name: "Acme Partners", value: 6200, stage: "Lead", owner: "Jamie Parker" },
  ]);
  const [open, setOpen] = useState(false);
  const stages = ["Lead", "Qualified", "Proposal", "Won"];
  return (
    <>
      <MetricCards
        items={[
          {
            label: "Pipeline value",
            value: "$" + deals.reduce((a, d) => a + d.value, 0).toLocaleString("en-US"),
            change: deals.length + " active opportunities",
          },
          { label: "Won this month", value: "$16,800", change: "2 new relationships" },
          { label: "Win rate", value: "32%", change: "+4% from last month" },
        ]}
      />
      <div className="spread">
        <h2>Deal pipeline</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          Add opportunity
        </Button>
      </div>
      <div className="kanban-board">
        {stages.map((stage) => (
          <div className="kanban-column" key={stage}>
            <h3>
              {stage}
              <Badge>{deals.filter((d) => d.stage === stage).length}</Badge>
            </h3>
            {deals
              .filter((d) => d.stage === stage)
              .map((d) => (
                <Card key={d.name}>
                  <h4>{d.name}</h4>
                  <strong>&#36;{d.value.toLocaleString("en-US")}</strong>
                  <p>{d.owner}</p>
                  <Select
                    label="Move to"
                    value={d.stage}
                    onChange={(e) =>
                      setDeals(
                        deals.map((x) => (x.name === d.name ? { ...x, stage: e.target.value } : x)),
                      )
                    }
                    options={stages.map((x) => ({ value: x, label: x }))}
                  />
                </Card>
              ))}
          </div>
        ))}
      </div>
      <Dialog title="New opportunity" open={open} onOpenChange={setOpen}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            setDeals([
              ...deals,
              {
                name: String(data.get("name")),
                value: Number(data.get("value")),
                stage: "Lead",
                owner: "Alex Morgan",
              },
            ]);
            setOpen(false);
          }}
        >
          <label className="ui-field">
            Company
            <Input name="name" required />
          </label>
          <label className="ui-field">
            Value ($)
            <Input type="number" name="value" min={0} required />
          </label>
          <Button type="submit">Create opportunity</Button>
        </form>
      </Dialog>
    </>
  );
}
function People() {
  const [approved, setApproved] = useState<string[]>([]);
  return (
    <>
      <MetricCards
        items={[
          { label: "Team members", value: "148", change: "8 joined this month" },
          { label: "On leave today", value: "6", change: "4% of the team" },
          { label: "Open roles", value: "12", change: "3 final interviews" },
          { label: "Team satisfaction", value: "4.8 / 5", change: "From 126 responses" },
        ]}
      />
      <div className="dashboard-grid">
        <DataTable
          title="People directory"
          rows={people.map((name, i) => ({
            id: i,
            name,
            department: ["Product", "Engineering", "Design", "Operations"][i % 4],
            status: i === 2 ? "On leave" : "Active",
            location: i % 2 ? "Remote" : "London",
          }))}
          columns={[
            { key: "name", label: "Name" },
            { key: "department", label: "Department" },
            { key: "status", label: "Status" },
            { key: "location", label: "Location" },
          ]}
        />
        <Card>
          <h3>Leave requests</h3>
          {["Jamie Parker", "Casey Chen"].map((name, i) => (
            <div className="request-row" key={name}>
              <Avatar name={name} />
              <div>
                <strong>{name}</strong>
                <p>
                  Oct {14 + i}–{16 + i} · Annual leave
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={approved.includes(name)}
                onClick={() => setApproved([...approved, name])}
              >
                {approved.includes(name) ? "Approved" : "Approve"}
              </Button>
            </div>
          ))}
          <h3>Upcoming milestones</h3>
          <p>Sam Rivera · 3-year anniversary</p>
          <p>Jordan Lee · Birthday this Friday</p>
        </Card>
      </div>
    </>
  );
}
function Finance() {
  const [rows, setRows] = useState<Row[]>(
    people.map((name, i) => ({
      id: "INV-" + (1040 + i),
      client: ["Northstar", "Fieldwork", "Forma", "Layer"][i % 4],
      amount: 1200 + i * 840,
      status: i % 3 === 0 ? "Overdue" : i % 3 === 1 ? "Paid" : "Pending",
      due: "2026-10-" + (12 + i),
    })),
  );
  return (
    <>
      <div className="finance-balance">
        <span>Available balance</span>
        <strong>$128,420.50</strong>
        <Badge>Updated from local sample data</Badge>
      </div>
      <MetricCards
        items={[
          { label: "Income this month", value: "$48,295", change: "+12.8% month over month" },
          { label: "Expenses", value: "$24,180", change: "Within planned budget" },
          { label: "Outstanding invoices", value: "$18,640", change: "3 require follow-up" },
        ]}
      />
      <div className="dashboard-grid">
        <ChartPanel title="Cash flow" type="bar" />
        <Card>
          <h3>Quick reconciliation</h3>
          <p>Mark the oldest pending invoice as paid in this local demo.</p>
          <Button
            disabled={!rows.some((r) => r.status === "Pending")}
            onClick={() => {
              const first = rows.find((r) => r.status === "Pending");
              setRows(rows.map((r) => (r === first ? { ...r, status: "Paid" } : r)));
            }}
          >
            Reconcile next invoice
          </Button>
          <Progress label="Monthly budget used" value={68} />
        </Card>
      </div>
      <DataTable
        title="Invoices"
        rows={rows}
        columns={[
          { key: "id", label: "Invoice" },
          { key: "client", label: "Client" },
          { key: "amount", label: "Amount ($)" },
          { key: "status", label: "Status" },
          { key: "due", label: "Due date" },
        ]}
      />
    </>
  );
}
function Kanban() {
  const [view, setView] = useState("Board");
  const [tasks, setTasks] = useState([
    { id: 1, title: "Research synthesis", status: "To do", priority: "High" },
    { id: 2, title: "Navigation exploration", status: "In progress", priority: "Medium" },
    { id: 3, title: "Component audit", status: "In progress", priority: "High" },
    { id: 4, title: "Usability testing", status: "Review", priority: "Medium" },
    { id: 5, title: "Release notes", status: "Done", priority: "Low" },
  ]);
  const [open, setOpen] = useState(false);
  const stages = ["To do", "In progress", "Review", "Done"];
  return (
    <>
      <div className="spread">
        <div className="filter-chips">
          {["Board", "List"].map((v) => (
            <Button key={v} variant={view === v ? "default" : "outline"} onClick={() => setView(v)}>
              {v}
            </Button>
          ))}
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          New task
        </Button>
      </div>
      {view === "List" ? (
        <DataTable
          title="Project tasks"
          rows={tasks}
          columns={[
            { key: "title", label: "Task" },
            { key: "status", label: "Status" },
            { key: "priority", label: "Priority" },
          ]}
        />
      ) : (
        <div className="kanban-board">
          {stages.map((stage) => (
            <div className="kanban-column" key={stage}>
              <h3>
                {stage}
                <Badge>{tasks.filter((t) => t.status === stage).length}</Badge>
              </h3>
              {tasks
                .filter((t) => t.status === stage)
                .map((t) => (
                  <Card key={t.id}>
                    <Badge>{t.priority}</Badge>
                    <h4>{t.title}</h4>
                    <div className="spread">
                      <Avatar name={people[t.id % 8]} />
                      <small>Oct {12 + t.id}</small>
                    </div>
                    <Select
                      label="Move task"
                      value={t.status}
                      onChange={(e) =>
                        setTasks(
                          tasks.map((x) => (x.id === t.id ? { ...x, status: e.target.value } : x)),
                        )
                      }
                      options={stages.map((x) => ({ value: x, label: x }))}
                    />
                  </Card>
                ))}
            </div>
          ))}
        </div>
      )}
      <Dialog title="Create a task" open={open} onOpenChange={setOpen}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            setTasks([
              ...tasks,
              {
                id: tasks.length + 1,
                title: String(data.get("title")),
                status: "To do",
                priority: "Medium",
              },
            ]);
            setOpen(false);
          }}
        >
          <label className="ui-field">
            Task title
            <Input name="title" required />
          </label>
          <Button type="submit">Create task</Button>
        </form>
      </Dialog>
      <Card>
        <h3>Release priorities</h3>
        <PriorityList />
      </Card>
    </>
  );
}
function PriorityList() {
  const [items, setItems] = useState([
    "Resolve accessibility findings",
    "Review responsive layouts",
    "Publish release notes",
  ]);
  return <ReorderList items={items} onChange={setItems} />;
}
function Inventory() {
  const [rows, setRows] = useState<Row[]>(
    [
      "Studio Chair",
      "Arc Lamp",
      "Everyday Tote",
      "Ceramic Set",
      "Oak Desk",
      "Linen Throw",
      "Wall Shelf",
      "Wool Rug",
    ].map((name, i) => ({
      id: "SKU-" + (200 + i),
      name,
      stock: [48, 12, 126, 8, 24, 64, 18, 5][i],
      warehouse: i % 2 ? "West" : "Central",
      status: [48, 12, 126, 8, 24, 64, 18, 5][i] < 15 ? "Low stock" : "In stock",
    })),
  );
  return (
    <>
      <MetricCards
        items={[
          {
            label: "Total units",
            value: String(rows.reduce((a, r) => a + Number(r.stock), 0)),
            change: "Across 2 warehouses",
          },
          {
            label: "Low stock alerts",
            value: String(rows.filter((r) => r.status === "Low stock").length),
            change: "Reorder recommended",
          },
          { label: "Inventory value", value: "$84,260", change: "+6.2% this month" },
        ]}
      />
      <div className="inventory-alert">
        <div>
          <h3>Keep your shelves ready</h3>
          <p>Receive 20 units for each low-stock item in this demo.</p>
        </div>
        <Button
          disabled={!rows.some((r) => r.status === "Low stock")}
          onClick={() =>
            setRows(
              rows.map((r) =>
                r.status === "Low stock"
                  ? { ...r, stock: Number(r.stock) + 20, status: "In stock" }
                  : r,
              ),
            )
          }
        >
          Receive replenishment
        </Button>
      </div>
      <DataTable
        title="Stock inventory"
        rows={rows}
        columns={[
          { key: "id", label: "SKU" },
          { key: "name", label: "Product" },
          { key: "stock", label: "Units" },
          { key: "warehouse", label: "Warehouse" },
          { key: "status", label: "Status" },
        ]}
      />
      <ChartPanel title="Weekly stock movement" type="bar" />
    </>
  );
}
function Students() {
  const [grade, setGrade] = useState("All");
  const rows = people
    .map((name, i) => ({
      id: i,
      name,
      grade: String(6 + (i % 3)),
      attendance: 94 + (i % 6) + "%",
      status: i === 3 ? "Absent" : "Present",
    }))
    .filter((r) => grade === "All" || r.grade === grade);
  return (
    <>
      <MetricCards
        items={[
          { label: "Enrolled students", value: "864", change: "Across 32 classes" },
          { label: "Attendance today", value: "96.4%", change: "+1.2% this week" },
          { label: "Teachers", value: "48", change: "18:1 student ratio" },
        ]}
      />
      <div className="dashboard-grid">
        <Card>
          <h3>Today’s timetable</h3>
          {[
            "09:00 · Mathematics · Room 12",
            "10:00 · English · Room 08",
            "11:30 · Science lab · Lab 2",
            "14:00 · Creative arts · Studio",
          ].map((t) => (
            <p className="schedule-line" key={t}>
              <Clock size={16} />
              {t}
            </p>
          ))}
        </Card>
        <Card>
          <h3>Term progress</h3>
          <Progress value={64} label="Teaching weeks completed" />
          <p>Parent conferences · October 20–22</p>
          <p>Autumn break · October 26–30</p>
        </Card>
      </div>
      <Select
        label="Grade"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        options={["All", "6", "7", "8"].map((x) => ({ value: x, label: x }))}
      />
      <DataTable
        title="Student attendance"
        rows={rows}
        columns={[
          { key: "name", label: "Student" },
          { key: "grade", label: "Grade" },
          { key: "attendance", label: "Attendance" },
          { key: "status", label: "Today" },
        ]}
      />
    </>
  );
}
function Community() {
  const [booked, setBooked] = useState<string[]>([]);
  const [requests, setRequests] = useState([
    { id: 1, request: "Lobby lighting", unit: "A-204", status: "Open" },
    { id: 2, request: "Garden maintenance", unit: "Common", status: "In progress" },
    { id: 3, request: "Access card replacement", unit: "B-108", status: "Completed" },
  ]);
  return (
    <>
      <MetricCards
        items={[
          { label: "Occupied homes", value: "186 / 200", change: "93% occupancy" },
          {
            label: "Open requests",
            value: String(requests.filter((r) => r.status !== "Completed").length),
            change: "Average response: 4 hours",
          },
          { label: "Upcoming events", value: "4", change: "This month" },
        ]}
      />
      <div className="dashboard-grid equal">
        <Card>
          <h3>Book a shared space</h3>
          {[
            "Rooftop garden · Friday 6 PM",
            "Community room · Saturday 10 AM",
            "Tennis court · Sunday 9 AM",
          ].map((x) => (
            <div className="request-row" key={x}>
              <span>{x}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setBooked(booked.includes(x) ? booked.filter((v) => v !== x) : [...booked, x])
                }
              >
                {booked.includes(x) ? "Cancel booking" : "Reserve"}
              </Button>
            </div>
          ))}
        </Card>
        <Card>
          <h3>Community noticeboard</h3>
          <Badge>October 18 · 4 PM</Badge>
          <h4>Autumn neighborhood gathering</h4>
          <p>Join your neighbors in the courtyard for an afternoon of food and conversation.</p>
          <Button
            variant="outline"
            onClick={() =>
              setRequests([
                ...requests,
                {
                  id: requests.length + 1,
                  request: "Event volunteering",
                  unit: "A-102",
                  status: "Open",
                },
              ])
            }
          >
            Volunteer to help
          </Button>
        </Card>
      </div>
      <DataTable
        title="Resident requests"
        rows={requests}
        columns={[
          { key: "request", label: "Request" },
          { key: "unit", label: "Unit" },
          { key: "status", label: "Status" },
        ]}
      />
    </>
  );
}
function Logistics() {
  const [route, setRoute] = useState("North");
  return (
    <>
      <MetricCards
        items={[
          {
            label: "Deliveries today",
            value: route === "North" ? "124" : "96",
            change: "92% on schedule",
          },
          { label: "Active vehicles", value: "18 / 24", change: "6 available for dispatch" },
          { label: "Average delivery", value: "34 min", change: "6 min faster this week" },
        ]}
      />
      <div className="dashboard-grid">
        <Card>
          <div className="spread">
            <h3>Route overview</h3>
            <Select
              label="Region"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              options={["North", "South"].map((x) => ({ value: x, label: x }))}
            />
          </div>
          <div className="route-map">
            <svg
              viewBox="0 0 600 280"
              role="img"
              aria-label={"Schematic route for " + route + " region"}
            >
              <path
                d={
                  route === "North"
                    ? "M60 220 L160 140 L280 170 L360 70 L520 100"
                    : "M60 80 L180 180 L300 130 L420 220 L540 140"
                }
                fill="none"
                stroke="var(--primary)"
                strokeWidth="5"
                strokeDasharray="10 6"
              />
              {(route === "North"
                ? [
                    [60, 220],
                    [160, 140],
                    [280, 170],
                    [360, 70],
                    [520, 100],
                  ]
                : [
                    [60, 80],
                    [180, 180],
                    [300, 130],
                    [420, 220],
                    [540, 140],
                  ]
              ).map(([x, y], i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="13" fill="var(--primary)" />
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fill="var(--primary-foreground)"
                    fontSize="13"
                  >
                    {i + 1}
                  </text>
                </g>
              ))}
            </svg>
            <span>Schematic sample routes · {route} district</span>
          </div>
        </Card>
        <Card>
          <h3>Dispatch readiness</h3>
          <Progress value={75} label="Fleet utilization" />
          <Progress value={92} label="On-time deliveries" />
          <Progress value={88} label="Driver availability" />
          <p>
            <Truck size={18} /> Next departure: 2:30 PM
          </p>
        </Card>
      </div>
      <DataTable
        title="Active shipments"
        rows={people.slice(0, 6).map((name, i) => ({
          id: "SHP-" + (4200 + i),
          driver: name,
          destination: route + " / Zone " + (i + 1),
          status: i % 3 ? "In transit" : "Delivered",
          eta: 14 + i + ":30",
        }))}
        columns={[
          { key: "id", label: "Shipment" },
          { key: "driver", label: "Driver" },
          { key: "destination", label: "Destination" },
          { key: "status", label: "Status" },
          { key: "eta", label: "ETA" },
        ]}
      />
    </>
  );
}
function Tenants() {
  const [tenant, setTenant] = useState("Northstar Group");
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Row[]>(
    people.map((name, i) => ({
      name,
      workspace: i % 2 ? "Product" : "Operations",
      role: i === 0 ? "Owner" : i < 3 ? "Admin" : "Member",
      status: "Active",
    })),
  );
  return (
    <>
      <div className="tenant-banner">
        <div>
          <Building2 size={30} />
          <div>
            <h2>{tenant}</h2>
            <p>Enterprise organization · 3 workspaces</p>
          </div>
        </div>
        <Select
          label="Organization"
          value={tenant}
          onChange={(e) => setTenant(e.target.value)}
          options={["Northstar Group", "Fieldwork Labs", "Forma Studio"].map((x) => ({
            value: x,
            label: x,
          }))}
        />
      </div>
      <MetricCards
        items={[
          {
            label: "Monthly usage",
            value: tenant === "Northstar Group" ? "842,560" : "326,180",
            change: "API requests this cycle",
          },
          {
            label: "Active seats",
            value: String(members.length) + " / 50",
            change: "Enterprise plan",
          },
          { label: "Workspaces", value: "3", change: "All systems operational" },
        ]}
      />
      <div className="workspace-cards">
        {["Product", "Operations", "Sandbox"].map((x, i) => (
          <Card key={x}>
            <LayersIcon />
            <h3>{x}</h3>
            <p>
              {[24, 18, 8][i]} members · {tenant}
            </p>
            <Progress value={[68, 42, 18][i]} label="Storage used" />
          </Card>
        ))}
      </div>
      <div className="spread">
        <h3>Organization access</h3>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          Invite member
        </Button>
      </div>
      <DataTable
        title="Members & roles"
        rows={members}
        columns={[
          { key: "name", label: "Member" },
          { key: "workspace", label: "Workspace" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" },
        ]}
      />
      <Dialog title="Invite a member" open={open} onOpenChange={setOpen}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            setMembers([
              ...members,
              {
                name: String(data.get("email")),
                workspace: "Product",
                role: String(data.get("role")),
                status: "Invited",
              },
            ]);
            setOpen(false);
          }}
        >
          <label className="ui-field">
            Email
            <Input name="email" type="email" required />
          </label>
          <Select
            name="role"
            label="Role"
            options={["Member", "Admin", "Viewer"].map((x) => ({ value: x, label: x }))}
          />
          <Button type="submit">Add demo invitation</Button>
          <p className="muted">This local demo sends no email and grants no real access.</p>
        </form>
      </Dialog>
    </>
  );
}
function LayersIcon() {
  return <Building2 size={24} />;
}
function Settings() {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);
  return (
    <Card>
      <h3>Workspace settings</h3>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
        }}
      >
        <label className="ui-field">
          Workspace name
          <Input defaultValue="Design workspace" required />
        </label>
        <Select
          label="Default role"
          options={["Member", "Viewer", "Admin"].map((x) => ({ value: x, label: x }))}
        />
        <Switch label="Email digest" checked={notifications} onCheckedChange={setNotifications} />
        <Button type="submit">Save settings locally</Button>
      </form>
      {saved && <Alert title="Settings saved for this preview" variant="success" />}
    </Card>
  );
}
function Notifications() {
  const [read, setRead] = useState(false);
  return (
    <Card>
      <div className="spread">
        <h3>Notifications</h3>
        <Button size="sm" variant="outline" onClick={() => setRead(true)}>
          Mark all read
        </Button>
      </div>
      {read ? (
        <EmptyState title="You're all caught up" description="No unread notifications." />
      ) : (
        <ul className="notification-list">
          <li>
            <Badge>New</Badge> Weekly summary is ready to review.
          </li>
          <li>
            <Badge>New</Badge> Two requests are awaiting your response.
          </li>
        </ul>
      )}
    </Card>
  );
}
const views: Record<string, () => React.ReactNode> = {
  overview: Overview,
  analytics: Analytics,
  pipeline: Pipeline,
  people: People,
  finance: Finance,
  kanban: Kanban,
  inventory: Inventory,
  students: Students,
  community: Community,
  logistics: Logistics,
  tenants: Tenants,
  settings: Settings,
  activity: Activity,
  notifications: Notifications,
};
export function AppSection({ content, variant }: SectionProps) {
  const [period, setPeriod] = useState("30");
  const View = views[variant];
  if (!View) throw new Error("Unknown workspace " + variant);
  const main = !["activity", "settings", "notifications"].includes(variant);
  return (
    <section className={"workspace-view workspace-" + variant}>
      {main && (
        <header className="dashboard-heading">
          <div>
            <span className="eyebrow">MONDAY, OCTOBER 12</span>
            <h1>{content.title}</h1>
            <p>{content.description}</p>
          </div>
          <div className="filter-chips">
            <Select
              label="Report period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              options={[
                { value: "7", label: "Last 7 days" },
                { value: "30", label: "Last 30 days" },
                { value: "90", label: "Last 90 days" },
              ]}
            />
            <Button
              variant="outline"
              onClick={() =>
                downloadText(
                  variant + "-report.json",
                  JSON.stringify(
                    {
                      report: variant,
                      periodDays: Number(period),
                      source: "local sample data",
                      generatedFor: content.title,
                    },
                    null,
                    2,
                  ),
                )
              }
            >
              <Download size={16} />
              Export report
            </Button>
          </div>
        </header>
      )}
      <ReportPeriod.Provider value={Number(period)}>
        <View />
      </ReportPeriod.Provider>
    </section>
  );
}
