"use client";
import { useState } from "react";
import { MapPin, ShoppingBag, Heart, ArrowUpRight, Check, Star } from "lucide-react";
import {
  Button,
  Card,
  Input,
  Select,
  Textarea,
  Badge,
  Dialog,
  Alert,
  Tabs,
  Progress,
  Accordion,
  Avatar,
  EmptyState,
} from "@/components/ui/primitives";
import { Heading, SampleVisual, ItemCards, type SectionProps } from "./shared";
import { FaqSection } from "./faq";
type Item = SectionProps["content"]["items"][number];
function Photo({ item, index = 0 }: { item: Item; index?: number }) {
  return (
    <div
      className="content-photo"
      role="img"
      aria-label={item.title}
      style={{
        backgroundImage:
          "url(" +
          (item.image ||
            "/images/" +
              ["architecture", "interior", "landscape", "objects", "city", "coast"][index % 6] +
              ".jpg") +
          ")",
      }}
    />
  );
}
function Gallery(p: SectionProps) {
  const [selected, setSelected] = useState<Item | null>(null);
  return (
    <>
      <Heading content={p.content} />
      <div className="gallery-grid">
        {p.content.items.map((item, i) => (
          <button className="gallery-item" key={i} onClick={() => setSelected(item)}>
            <Photo item={item} index={i} />
            <span>
              <strong>{item.title}</strong>
              <small>{item.description}</small>
              <ArrowUpRight size={20} />
            </span>
          </button>
        ))}
      </div>
      <Dialog
        title={selected?.title || "Selected work"}
        description={selected?.description}
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        {selected && <Photo item={selected} />}
      </Dialog>
    </>
  );
}
function Articles(p: SectionProps) {
  const [selected, setSelected] = useState<Item | null>(null);
  return (
    <>
      <Heading content={p.content} />
      <div className="article-grid">
        {p.content.items.map((item, i) => (
          <article key={i}>
            <Photo item={item} index={i} />
            <span className="eyebrow">{i % 2 ? "Culture" : "Perspectives"} · 6 min read</span>
            <h3>
              <button className="text-button" onClick={() => setSelected(item)}>
                {item.title}
              </button>
            </h3>
            <p>{item.description}</p>
            <span className="muted">October {8 - i}, 2026 · The editorial team</span>
          </article>
        ))}
      </div>
      <Dialog
        title={selected?.title || "Article"}
        description="A sample editorial story."
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        <p>{selected?.description}</p>
        <p>
          Good ideas often begin with close observation. In our conversations with makers,
          designers, and neighbors, one theme keeps returning: meaningful change grows from
          attention to ordinary things.
        </p>
        <p>
          Start small. Ask a better question, make time to listen, and give the work room to
          develop. The best next step is often the one you can take today.
        </p>
      </Dialog>
    </>
  );
}
function Products(p: SectionProps) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [category, setCategory] = useState("All");
  const [show, setShow] = useState(false);
  const products = p.content.items.filter(
    (i) =>
      i.title.toLowerCase().includes(q.toLowerCase()) &&
      (category === "All" || i.category === category),
  );
  if (sort !== "featured")
    products.sort((a, b) =>
      sort === "low" ? (a.price || 0) - (b.price || 0) : (b.price || 0) - (a.price || 0),
    );
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return (
    <>
      <Heading content={p.content}>
        <Button variant="outline" onClick={() => setShow(true)}>
          <ShoppingBag size={17} />
          Bag ({count})
        </Button>
      </Heading>
      <div className="collection-filters">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the collection"
          aria-label="Search products"
        />
        <Select
          label="Collection"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={["All", "Featured", "Essentials"].map((x) => ({ value: x, label: x }))}
        />
        <Select
          label="Sort by"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          options={[
            { value: "featured", label: "Featured" },
            { value: "low", label: "Price: low to high" },
            { value: "high", label: "Price: high to low" },
          ]}
        />
      </div>
      <div className="product-grid">
        {products.map((item, i) => (
          <Card key={item.title}>
            <Photo item={item} index={i} />
            <div className="spread">
              <h3>{item.title}</h3>
              <strong>&#36;{item.price || 249}</strong>
            </div>
            <p>{item.description}</p>
            <Button
              variant="outline"
              onClick={() => setCart({ ...cart, [item.title]: (cart[item.title] || 0) + 1 })}
            >
              Add to bag
            </Button>
          </Card>
        ))}
      </div>
      {!products.length && <EmptyState />}
      <Dialog
        title={"Your bag · " + count + " items"}
        description="Local sample cart. No payment is collected."
        open={show}
        onOpenChange={setShow}
      >
        {count ? (
          Object.entries(cart)
            .filter(([, n]) => n > 0)
            .map(([name, n]) => (
              <div className="cart-line" key={name}>
                <span>
                  {name} × {n}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCart({ ...cart, [name]: Math.max(0, n - 1) })}
                >
                  Remove one
                </Button>
              </div>
            ))
        ) : (
          <EmptyState
            title="Your bag is empty"
            description="Explore the collection and add something you like."
          />
        )}
        <p>
          Subtotal: &#36;
          {p.content.items
            .reduce((sum, i) => sum + (cart[i.title] || 0) * (i.price || 249), 0)
            .toLocaleString("en-US")}
        </p>
      </Dialog>
    </>
  );
}
function ProductDetail(p: SectionProps) {
  const [finish, setFinish] = useState("Natural oak");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  return (
    <div className="product-detail">
      <Photo item={{ title: "Everyday chair", image: "/images/interior.jpg" }} />
      <div>
        <Badge>Crafted to last</Badge>
        <h2>{p.content.title}</h2>
        <p>
          Solid oak, a gently curved backrest, and a hand-finished surface. A versatile piece made
          for everyday living.
        </p>
        <strong className="price">$249</strong>
        <Select
          label="Finish"
          value={finish}
          onChange={(e) => {
            setFinish(e.target.value);
            setAdded(false);
          }}
          options={["Natural oak", "Smoked oak", "Black oak"].map((x) => ({ value: x, label: x }))}
        />
        <label className="ui-field">
          Quantity
          <Input
            type="number"
            min={1}
            max={10}
            value={quantity}
            onChange={(e) => {
              setQuantity(Math.max(1, Math.min(10, Number(e.target.value))));
              setAdded(false);
            }}
          />
        </label>
        <Button onClick={() => setAdded(true)}>Add to bag · &#36;{249 * quantity}</Button>
        {added && (
          <Alert title="Added to the demo bag" variant="success">
            {quantity} × {finish}. No purchase has been made.
          </Alert>
        )}
        <Accordion
          items={[
            {
              title: "Materials & dimensions",
              content: "FSC-certified solid oak. W 48 × D 52 × H 78 cm. Seat height 45 cm.",
            },
            {
              title: "Delivery & care",
              content:
                "Sample delivery estimate: 5–7 business days. Wipe clean with a soft, dry cloth.",
            },
          ]}
        />
      </div>
    </div>
  );
}
function Booking(p: SectionProps) {
  const [done, setDone] = useState(false);
  const [date, setDate] = useState("");
  return (
    <div className="booking-layout">
      <Heading content={p.content} />
      <Card>
        <h3>Plan your visit</h3>
        <form
          className="form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <label className="ui-field">
            Your name
            <Input required autoComplete="name" />
          </label>
          <label className="ui-field">
            Email
            <Input required type="email" autoComplete="email" />
          </label>
          <label className="ui-field">
            Preferred date
            <Input
              required
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setDone(false);
              }}
            />
          </label>
          <Select
            label="Time"
            options={["09:00", "11:00", "14:00", "16:00", "19:00"].map((x) => ({
              value: x,
              label: x,
            }))}
          />
          <Select
            label="Guests"
            options={["1", "2", "3", "4", "5", "6"].map((x) => ({ value: x, label: x }))}
          />
          <Button type="submit">Request availability</Button>
        </form>
        {done && (
          <Alert title="Demo request recorded" variant="success">
            Your preferred date is {date}. This local preview does not create a reservation.
          </Alert>
        )}
      </Card>
    </div>
  );
}
function Properties(p: SectionProps) {
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const matches = p.content.items.filter((i) =>
    (i.title + " " + i.description).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <Heading content={p.content}>
        <Badge>{saved.length} saved</Badge>
      </Heading>
      <Input
        aria-label="Filter properties"
        placeholder="Search homes, beds, or features"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="property-grid">
        {matches.map((item, i) => (
          <Card key={i}>
            <Photo item={item} index={i} />
            <div className="spread">
              <Badge>For sale</Badge>
              <Button
                size="icon"
                variant="ghost"
                aria-label={"Save " + item.title}
                aria-pressed={saved.includes(item.title)}
                onClick={() =>
                  setSaved(
                    saved.includes(item.title)
                      ? saved.filter((x) => x !== item.title)
                      : [...saved, item.title],
                  )
                }
              >
                <Heart size={18} fill={saved.includes(item.title) ? "currentColor" : "none"} />
              </Button>
            </div>
            <h3>{item.title}</h3>
            <p>
              <MapPin size={14} /> {item.description}
            </p>
            <strong>&#36;{[685000, 425000, 940000][i % 3].toLocaleString("en-US")}</strong>
            <Button variant="outline" onClick={() => setSelected(item)}>
              View property
            </Button>
          </Card>
        ))}
      </div>
      {!matches.length && <EmptyState />}
      <Dialog
        title={selected?.title || "Property"}
        description={selected?.description}
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        <p>
          A light-filled home with considered spaces, convenient transport connections, and a
          welcoming neighborhood.
        </p>
        <Booking {...p} content={{ title: "Arrange a viewing", items: [] }} />
      </Dialog>
    </>
  );
}
function Menu(p: SectionProps) {
  const [category, setCategory] = useState("All");
  return (
    <>
      <Heading content={p.content} />
      <div className="filter-chips">
        {["All", "Small plates", "Mains", "Dessert"].map((x) => (
          <Button
            key={x}
            variant={category === x ? "default" : "outline"}
            onClick={() => setCategory(x)}
          >
            {x}
          </Button>
        ))}
      </div>
      <div className="menu-list">
        {p.content.items
          .map((item, i) => ({ ...item, index: i }))
          .filter(
            (i) =>
              category === "All" ||
              (category === "Small plates"
                ? i.index < 2
                : category === "Mains"
                  ? i.index === 2
                  : i.index === 3),
          )
          .map((item) => (
            <div key={item.title}>
              <span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </span>
              <strong>&#36;{[16, 14, 32, 12][item.index]}</strong>
            </div>
          ))}
      </div>
    </>
  );
}
function Course(p: SectionProps) {
  const [completed, setCompleted] = useState<string[]>([]);
  return (
    <>
      <Heading content={p.content} />
      <div className="course-layout">
        <Accordion
          items={p.content.items.map((i) => ({
            title: i.title,
            content: (
              <div>
                <p>{i.description}</p>
                <p>
                  Work through a practical exercise, review your decisions, and record one thing you
                  will apply to your next project.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setCompleted(
                      completed.includes(i.title)
                        ? completed.filter((x) => x !== i.title)
                        : [...completed, i.title],
                    )
                  }
                >
                  {completed.includes(i.title) ? "Mark incomplete" : "Mark complete"}
                </Button>
              </div>
            ),
          }))}
        />
        <Card>
          <Badge>Learn at your own pace</Badge>
          <h3>Your progress</h3>
          <Progress
            label="Lessons completed"
            value={(completed.length / Math.max(p.content.items.length, 1)) * 100}
          />
          <p>{p.content.items.length} practical modules · Lifetime access</p>
        </Card>
      </div>
    </>
  );
}
function Donation(p: SectionProps) {
  const [amount, setAmount] = useState(25);
  const [done, setDone] = useState(false);
  return (
    <div className="donation-layout">
      <div>
        <Heading content={p.content} />
        <Progress label="Community classroom fund · $38,240 of $50,000" value={76.48} />
        <p>
          Your support helps local partners provide safe learning spaces and essential materials.
        </p>
      </div>
      <Card>
        <h3>Choose your contribution</h3>
        <div className="filter-chips">
          {[10, 25, 50, 100].map((n) => (
            <Button
              key={n}
              variant={amount === n ? "default" : "outline"}
              onClick={() => {
                setAmount(n);
                setDone(false);
              }}
            >
              &#36;{n}
            </Button>
          ))}
        </div>
        <label className="ui-field">
          Custom amount ($)
          <Input
            type="number"
            min={1}
            max={100000}
            value={amount}
            onChange={(e) => {
              setAmount(Number(e.target.value));
              setDone(false);
            }}
          />
        </label>
        <Button disabled={amount < 1 || amount > 100000} onClick={() => setDone(true)}>
          Pledge &#36;{amount}
        </Button>
        {done && (
          <Alert title="Thank you for your demo pledge" variant="success">
            No money has been collected. Connect a payment provider for real donations.
          </Alert>
        )}
      </Card>
    </div>
  );
}
function Jobs(p: SectionProps) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [selected, setSelected] = useState<Item | null>(null);
  const [applied, setApplied] = useState(false);
  const matches = p.content.items.filter(
    (i) =>
      (i.title + " " + i.description).toLowerCase().includes(q.toLowerCase()) &&
      (type === "All" || i.description?.includes(type)),
  );
  return (
    <>
      <Heading content={p.content} />
      <div className="collection-filters">
        <Input
          aria-label="Search roles"
          placeholder="Role, company, or location"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Select
          label="Work arrangement"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={["All", "Remote", "Full-time", "Part-time"].map((x) => ({ value: x, label: x }))}
        />
      </div>
      <div className="job-list">
        {matches.map((item, i) => (
          <Card key={i}>
            <Avatar name={item.description?.split(" · ")[0] || "Company"} />
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <Badge>{i % 2 ? "$110k–150k" : "$90k–130k"}</Badge>
            <Button
              variant="outline"
              onClick={() => {
                setSelected(item);
                setApplied(false);
              }}
            >
              View role
            </Button>
          </Card>
        ))}
      </div>
      {!matches.length && <EmptyState />}
      <Dialog
        title={selected?.title || "Role"}
        description={selected?.description}
        open={!!selected}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        <p>
          Work with a thoughtful team on meaningful product challenges. We value clear
          communication, curiosity, and care for the details.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setApplied(true);
          }}
        >
          <label className="ui-field">
            Email address
            <Input type="email" required />
          </label>
          <label className="ui-field">
            Portfolio or profile URL
            <Input type="url" required />
          </label>
          <Button type="submit">Submit demo application</Button>
        </form>
        {applied && (
          <Alert title="Demo application submitted">No application was sent or stored.</Alert>
        )}
      </Dialog>
    </>
  );
}
function Events(p: SectionProps) {
  const [saved, setSaved] = useState<string[]>([]);
  return (
    <>
      <Heading content={p.content} />
      <div className="event-list">
        {p.content.items.map((item, i) => (
          <Card key={i}>
            <div className="date-tile">
              <span>OCT</span>
              <strong>{22 + i}</strong>
            </div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                setSaved(
                  saved.includes(item.title)
                    ? saved.filter((s) => s !== item.title)
                    : [...saved, item.title],
                )
              }
            >
              {saved.includes(item.title) ? "Added to my schedule" : "Add to my schedule"}
            </Button>
          </Card>
        ))}
      </div>
      <p role="status">{saved.length} sessions in your local schedule.</p>
    </>
  );
}
function Tracks(p: SectionProps) {
  const [selected, setSelected] = useState(0);
  return (
    <>
      <Heading content={p.content} />
      <ol className="track-list">
        {p.content.items.map((item, i) => (
          <li key={i}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <Button variant={selected === i ? "default" : "outline"} onClick={() => setSelected(i)}>
              Track details
            </Button>
          </li>
        ))}
      </ol>
      <Card>
        <h3>{p.content.items[selected]?.title}</h3>
        <p>
          An intimate arrangement of piano, layered vocals, and quiet textures. Written and produced
          by Luna Vale.
        </p>
        <p className="muted">Supply licensed audio files to add playback in your application.</p>
      </Card>
    </>
  );
}
function Contact(p: SectionProps) {
  const [done, setDone] = useState(false);
  return (
    <div className="contact-layout">
      <div>
        <Heading content={p.content} />
        <p>Tell us a little about what you have in mind.</p>
        <p className="muted">Monday–Friday · 9:00 AM–5:00 PM</p>
      </div>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
      >
        <label className="ui-field">
          Name
          <Input autoComplete="name" required />
        </label>
        <label className="ui-field">
          Email
          <Input type="email" autoComplete="email" required />
        </label>
        <label className="ui-field full">
          What can we help with?
          <Textarea rows={4} required />
        </label>
        <Button type="submit">Send demo message</Button>
        {done && (
          <Alert title="Message preview complete" variant="success">
            This demo does not send email. Connect your own service.
          </Alert>
        )}
      </form>
    </div>
  );
}
function Admissions(p: SectionProps) {
  return (
    <>
      <Heading content={p.content} />
      <Tabs
        items={["Undergraduate", "Graduate", "International"].map((label) => ({
          id: label,
          label,
          content: (
            <div className="admissions-grid">
              <Card>
                <h3>{label} admissions</h3>
                <p>
                  {label === "Graduate"
                    ? "Deepen your expertise through research and advanced study."
                    : label === "International"
                      ? "Join a global community with support from arrival to graduation."
                      : "Explore more than 80 programs across arts, sciences, and professional studies."}
                </p>
                <Badge>Applications open · Fall 2027</Badge>
              </Card>
              <Card>
                <h3>Your application checklist</h3>
                <ul>
                  <li>
                    <Check size={16} />
                    Academic transcripts
                  </li>
                  <li>
                    <Check size={16} />
                    Personal statement
                  </li>
                  <li>
                    <Check size={16} />
                    References
                  </li>
                </ul>
                <a href="#content-contact">Ask about {label.toLowerCase()} applications</a>
              </Card>
            </div>
          ),
        }))}
      />
    </>
  );
}
function Leaderboard(p: SectionProps) {
  const [period, setPeriod] = useState("Weekly");
  return (
    <>
      <Heading content={p.content}>
        <Select
          label="Rankings"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          options={["Weekly", "Monthly"].map((x) => ({ value: x, label: x }))}
        />
      </Heading>
      <div className="leaderboard">
        {["NovaStrike", "PixelPilot", "EchoWave", "LunarFox", "SkyRunner"].map((name, i) => (
          <div key={name}>
            <strong>#{i + 1}</strong>
            <Avatar name={name} />
            <span>{name}</span>
            <Badge>
              {(period === "Weekly" ? 9800 - i * 720 : 38200 - i * 2180).toLocaleString("en-US")} XP
            </Badge>
          </div>
        ))}
      </div>
    </>
  );
}
function Cookie() {
  const [choice, setChoice] = useState<string | null>(null);
  return choice ? (
    <Alert title={"Cookie preference: " + choice}>
      <Button variant="ghost" size="sm" onClick={() => setChoice(null)}>
        Change preference
      </Button>
    </Alert>
  ) : (
    <Card>
      <h3>Your privacy choices</h3>
      <p>
        This sample uses no analytics cookies. Optional cookie preferences apply only to this
        preview.
      </p>
      <div className="filter-chips">
        <Button onClick={() => setChoice("essential only")}>Essential only</Button>
        <Button variant="outline" onClick={() => setChoice("all allowed")}>
          Allow all
        </Button>
      </div>
    </Card>
  );
}
export function ContentSection(p: SectionProps) {
  let body: React.ReactNode;
  switch (p.variant) {
    case "gallery":
      body = <Gallery {...p} />;
      break;
    case "articles":
      body = <Articles {...p} />;
      break;
    case "products":
      body = <Products {...p} />;
      break;
    case "product-detail":
      body = <ProductDetail {...p} />;
      break;
    case "booking":
      body = <Booking {...p} />;
      break;
    case "properties":
      body = <Properties {...p} />;
      break;
    case "menu":
      body = <Menu {...p} />;
      break;
    case "course":
      body = <Course {...p} />;
      break;
    case "donation":
      body = <Donation {...p} />;
      break;
    case "jobs":
      body = <Jobs {...p} />;
      break;
    case "events":
    case "schedule":
      body = <Events {...p} />;
      break;
    case "tracks":
      body = <Tracks {...p} />;
      break;
    case "contact":
      body = <Contact {...p} />;
      break;
    case "admissions":
      body = <Admissions {...p} />;
      break;
    case "leaderboard":
      body = <Leaderboard {...p} />;
      break;
    case "cookie":
      body = <Cookie />;
      break;
    case "faq-search":
      return (
        <FaqSection
          {...p}
          variant="search"
          content={{
            ...p.content,
            items: [
              {
                title: "Getting started with your account",
                description: "Create your profile, choose a workspace, and invite your team.",
              },
              {
                title: "Managing your subscription",
                description: "Review plans and billing details in your account settings.",
              },
              {
                title: "Finding the right resource",
                description: "Use the search field to filter these guides by topic.",
              },
            ],
          }}
        />
      );
    case "metrics":
      body = (
        <div className="metrics-strip">
          {p.content.items.map((i) => (
            <div key={i.title}>
              <strong>{i.value || i.description}</strong>
              <span>{i.title}</span>
            </div>
          ))}
        </div>
      );
      break;
    case "logos":
      body = (
        <>
          <span className="eyebrow">{p.content.title}</span>
          <div className="logo-cloud">
            {["Northstar", "Layers", "fieldwork", "FORMA", "Quotient"].map((x) => (
              <strong key={x}>{x}</strong>
            ))}
          </div>
        </>
      );
      break;
    case "team":
      body = (
        <>
          <Heading content={p.content} />
          <div className="team-grid">
            {p.content.items.map((i, n) => (
              <Card key={i.title}>
                <div className={"team-portrait portrait-" + n}>
                  <Avatar name={i.title} />
                </div>
                <h3>{i.title}</h3>
                <p>{i.description}</p>
              </Card>
            ))}
          </div>
        </>
      );
      break;
    case "timeline":
      body = (
        <>
          <Heading content={p.content} />
          <ol className="timeline">
            {p.content.items.map((i, n) => (
              <li key={i.title}>
                <span>{n + 1}</span>
                <div>
                  <h3>{i.title}</h3>
                  <p>{i.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </>
      );
      break;
    case "comparison":
      body = (
        <>
          <Heading content={p.content} />
          <table className="comparison-table">
            <caption>Compare your options</caption>
            <thead>
              <tr>
                <th>What matters</th>
                <th>Essentials</th>
                <th>Complete</th>
              </tr>
            </thead>
            <tbody>
              {["Getting started", "Ongoing support", "Flexible options", "Team access"].map(
                (x, i) => (
                  <tr key={x}>
                    <th>{x}</th>
                    <td>{i < 2 ? "Included" : "Optional"}</td>
                    <td>Included</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </>
      );
      break;
    case "showcase":
      body = (
        <>
          <Heading content={p.content} />
          <SampleVisual />
          <div className="showcase-notes">
            <p>Thoughtful details, from the big picture to the everyday.</p>
            <Badge>Built around your workflow</Badge>
          </div>
        </>
      );
      break;
    case "reviews":
      body = (
        <>
          <Heading content={p.content} />
          <div className="reviews-summary">
            <strong>4.9</strong>
            <span>
              <Star fill="currentColor" /> Based on 128 sample reviews
            </span>
          </div>
          <div className="item-grid">
            {[
              "A thoughtful experience",
              "Exactly what I was looking for",
              "The details make it special",
            ].map((x) => (
              <Card key={x}>
                <h3>{x}</h3>
                <p>
                  Considered, useful, and easy to recommend. A welcome addition to the everyday.
                </p>
                <Badge>Verified sample review</Badge>
              </Card>
            ))}
          </div>
        </>
      );
      break;
    default:
      body = (
        <>
          <Heading content={p.content} />
          <ItemCards content={p.content} />
        </>
      );
  }
  return (
    <section className={"section content-section content-" + p.variant + " " + (p.className || "")}>
      {body}
    </section>
  );
}
