import { useReducer, useState, type ComponentType, type ReactNode } from "react";
import data from "./data.json";
import {
  mobileReducer,
  initialMobileState,
  cartTotal,
  signInError,
  checkoutError,
  type ScreenId,
} from "./state";

type Children = { children: ReactNode };
export type MobileKit = {
  Navigation: ComponentType<{
    items: { id: ScreenId; label: string }[];
    active: ScreenId;
    onChange: (id: ScreenId) => void;
  }>;
  Stack: ComponentType<Children>;
  Card: ComponentType<Children>;
  Title: ComponentType<Children>;
  Text: ComponentType<Children>;
  Art: ComponentType<Children>;
  Button: ComponentType<{
    children: ReactNode;
    onPress: () => void;
    selected?: boolean;
    disabled?: boolean;
  }>;
  Field: ComponentType<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    secure?: boolean;
    email?: boolean;
  }>;
  Choice: ComponentType<{
    label: string;
    value: string;
    options: readonly string[];
    onChange: (value: string) => void;
  }>;
  Toggle: ComponentType<{ label: string; value: boolean; onChange: () => void }>;
  Status: ComponentType<{ children: ReactNode; error?: boolean }>;
};

/** Shared demo behavior; the injected kit supplies actual DOM or native controls. */
export function MobileFlow({
  kit,
  initialScreen = "mobile-home",
  dark,
  onDarkChange,
}: {
  kit: MobileKit;
  initialScreen?: ScreenId;
  dark: boolean;
  onDarkChange: () => void;
}) {
  const { Stack, Card, Title, Text, Art, Button, Field, Choice, Toggle, Status, Navigation } = kit;
  const [state, dispatch] = useReducer(mobileReducer, initialScreen, initialMobileState);
  const [fields, setFields] = useState({
    email: "",
    password: "",
    address: "",
    name: state.name,
    query: "",
    category: "All",
    finish: "Natural",
    message: "",
    service: data.services[0].name,
    day: data.days[0],
    time: data.times[0],
  });
  const [error, setError] = useState("");
  const [unread, setUnread] = useState(false);
  const [reset, setReset] = useState(false);
  const field = (key: keyof typeof fields, label: string, secure = false, email = false) => (
    <Field
      label={label}
      value={fields[key]}
      onChange={(value) => {
        setFields((old) => ({ ...old, [key]: value }));
        setError("");
      }}
      secure={secure}
      email={email}
    />
  );
  const choice = (key: keyof typeof fields, label: string, options: readonly string[]) => (
    <Choice
      label={label}
      value={fields[key]}
      options={options}
      onChange={(value) => setFields((old) => ({ ...old, [key]: value }))}
    />
  );
  const go = (screen: ScreenId) => {
    setError("");
    dispatch({ type: "navigate", screen });
  };
  const product = data.products.find((p) => p.id === state.productId)!;
  const total = cartTotal(state.cart);
  const products = data.products.filter(
    (p) =>
      (fields.category === "All" || p.category === fields.category) &&
      p.name.toLowerCase().includes(fields.query.toLowerCase()),
  );
  const productCards = products.map((p) => (
    <Card key={p.id}>
      <Art>{p.symbol}</Art>
      <Text>{p.category}</Text>
      <Button onPress={() => dispatch({ type: "product", id: p.id })}>{p.name}</Button>
      <Text>${p.price}</Text>
    </Card>
  ));
  let content: ReactNode;
  switch (state.screen) {
    case "mobile-onboarding":
      content = (
        <>
          <Art>{data.onboarding[state.step].symbol}</Art>
          <Text>YOUR EVERYDAY, A LITTLE LIGHTER</Text>
          <Title>{data.onboarding[state.step].title}</Title>
          <Text>{data.onboarding[state.step].description}</Text>
          <Text>Step {state.step + 1} of 3</Text>
          <Button onPress={() => dispatch({ type: "next" })}>
            {state.step === 2 ? "Get started" : "Continue"}
          </Button>
          <Button onPress={() => go("mobile-home")}>Explore the demo</Button>
        </>
      );
      break;
    case "mobile-sign-in":
      content = (
        <>
          <Art>✦</Art>
          <Title>Welcome back.</Title>
          <Text>A quiet corner of your day. Use fictional details in this local demo.</Text>
          {field("email", "Email", false, true)}
          {field("password", "Password", true)}
          <Button
            onPress={() => {
              const message = signInError(fields.email, fields.password);
              setError(message);
              if (!message) {
                setFields((old) => ({ ...old, password: "" }));
                dispatch({ type: "sign-in" });
              }
            }}
          >
            Sign in to demo
          </Button>
          <Text>No account is created and credentials are not sent.</Text>
        </>
      );
      break;
    case "mobile-home":
      content = (
        <>
          <Text>GOOD MORNING, {state.name.split(" ")[0].toUpperCase()}</Text>
          <Title>Find your little reset.</Title>
          <Card>
            <Text>TODAY’S PRACTICE</Text>
            <Title>Five minutes. Just you.</Title>
            <Text>Pause, breathe and notice how you feel.</Text>
            <Button selected={state.completed} onPress={() => dispatch({ type: "complete" })}>
              {state.completed ? "Practice complete ✓" : "Mark practice complete"}
            </Button>
          </Card>
          <Button onPress={() => go("mobile-booking")}>Book a session</Button>
          <Button onPress={() => go("mobile-messages")}>Messages from Jordan</Button>
          <Title>Thoughtful essentials</Title>
          {productCards.slice(0, 2)}
        </>
      );
      break;
    case "mobile-search":
      content = (
        <>
          <Text>CURATED FOR YOUR EVERYDAY</Text>
          <Title>Discover something good.</Title>
          {field("query", "Search products")}
          {choice("category", "Category", ["All", "Essentials", "Workspace"])}
          <Text>{products.length} results</Text>
          {products.length ? (
            productCards
          ) : (
            <Card>
              <Title>No matches yet.</Title>
              <Text>Try another name or category.</Text>
              <Button onPress={() => setFields((old) => ({ ...old, query: "", category: "All" }))}>
                Clear filters
              </Button>
            </Card>
          )}
        </>
      );
      break;
    case "mobile-product":
      content = (
        <>
          <Art>{product.symbol}</Art>
          <Text>{product.category}</Text>
          <Title>{product.name}</Title>
          <Text>{product.detail}</Text>
          <Title>${product.price}</Title>
          {choice("finish", "Finish", data.finishes)}
          <Text>Selected finish: {fields.finish}</Text>
          <Button
            onPress={() =>
              dispatch({ type: "add", productId: product.id, finish: fields.finish, quantity: 1 })
            }
          >
            Add to bag
          </Button>
          <Button onPress={() => go("mobile-cart")}>View bag</Button>
        </>
      );
      break;
    case "mobile-cart":
      content = (
        <>
          <Title>Your everyday essentials.</Title>
          {state.cart.length ? (
            <>
              {state.cart.map((line, index) => (
                <Card key={line.productId + line.finish}>
                  <Text>
                    {data.products.find((p) => p.id === line.productId)!.name} · {line.finish}
                  </Text>
                  <Text>Quantity: {line.quantity}</Text>
                  <Button onPress={() => dispatch({ type: "quantity", index, delta: -1 })}>
                    Remove one {line.productId}
                  </Button>
                  <Button
                    disabled={line.quantity >= 99}
                    onPress={() => dispatch({ type: "quantity", index, delta: 1 })}
                  >
                    Add one {line.productId}
                  </Button>
                </Card>
              ))}
              <Title>Subtotal ${total}</Title>
              <Button onPress={() => go("mobile-checkout")}>Continue to checkout</Button>
            </>
          ) : (
            <Card>
              <Text>Your bag is empty.</Text>
              <Button onPress={() => go("mobile-search")}>Discover essentials</Button>
            </Card>
          )}
        </>
      );
      break;
    case "mobile-checkout":
      content = (
        <>
          <Title>{state.order ? "You’re all set." : "A few final details."}</Title>
          {state.order ? (
            <>
              <Text>Your demo order is confirmed. No payment was taken.</Text>
              <Button onPress={() => go("mobile-home")}>Return home</Button>
            </>
          ) : state.cart.length ? (
            <>
              {field("name", "Full name")}
              {field("email", "Delivery email", false, true)}
              {field("address", "Delivery address")}
              <Card>
                <Text>Demo total ${total} · shipping included</Text>
                <Text>Use fictional details. This preview does not process payments.</Text>
              </Card>
              <Button
                onPress={() => {
                  const message = checkoutError(fields.name, fields.email, fields.address);
                  setError(message);
                  if (!message) dispatch({ type: "order" });
                }}
              >
                Confirm demo order
              </Button>
            </>
          ) : (
            <Button onPress={() => go("mobile-search")}>Your bag is empty. Browse products</Button>
          )}
        </>
      );
      break;
    case "mobile-activity":
      content = (
        <>
          <Title>Your latest moments.</Title>
          <Toggle label="Unread only" value={unread} onChange={() => setUnread(!unread)} />
          <Button onPress={() => dispatch({ type: "read" })}>Mark all as read</Button>
          {unread && state.read ? (
            <Text>You’re all caught up.</Text>
          ) : (
            data.activity
              .filter((a) => !unread || a.unread)
              .map((a) => (
                <Card key={a.id}>
                  <Text>
                    {a.time}
                    {!state.read && a.unread ? " · Unread" : ""}
                  </Text>
                  <Title>{a.title}</Title>
                  <Text>{a.description}</Text>
                  {a.id === "a2" && (
                    <Button onPress={() => go("mobile-messages")}>Open conversation</Button>
                  )}
                </Card>
              ))
          )}
        </>
      );
      break;
    case "mobile-messages":
      content = (
        <>
          <Text>YOUR COACH</Text>
          <Title>A conversation with Jordan.</Title>
          {state.messages.map((message) => (
            <Card key={message.id}>
              <Text>{message.own ? "You" : "Jordan"}</Text>
              <Text>{message.text}</Text>
            </Card>
          ))}
          {field("message", "Message")}
          <Button
            disabled={!fields.message.trim()}
            onPress={() => {
              dispatch({ type: "send", text: fields.message });
              setFields((old) => ({ ...old, message: "" }));
            }}
          >
            Send locally
          </Button>
          <Text>Demo conversation. Messages stay in this preview.</Text>
        </>
      );
      break;
    case "mobile-booking":
      content = (
        <>
          <Text>TIME WELL SPENT</Text>
          <Title>Make room for yourself.</Title>
          {choice(
            "service",
            "Session",
            data.services.map((s) => s.name),
          )}
          <Text>
            {data.services.find((s) => s.name === fields.service)!.duration} · $
            {data.services.find((s) => s.name === fields.service)!.price}
          </Text>
          {choice("day", "Day (sample week)", data.days)}
          {choice("time", "Time", data.times)}
          <Button
            onPress={() =>
              dispatch({
                type: "book",
                service: data.services.find((s) => s.name === fields.service)!.id,
                day: fields.day,
                time: fields.time,
              })
            }
          >
            Save demo booking
          </Button>
          {state.booking && (
            <Card>
              <Title>Your session</Title>
              <Text>{state.booking}</Text>
            </Card>
          )}
          <Text>Sample dates and availability. No real appointment is reserved.</Text>
        </>
      );
      break;
    case "mobile-profile":
      content = (
        <>
          <Art>{state.name.slice(0, 1).toUpperCase()}</Art>
          <Title>{state.name}</Title>
          <Text>
            {state.signedIn ? "Signed in locally" : "Demo member"} · A fresh start, every day.
          </Text>
          {field("name", "Display name")}
          <Button
            disabled={!fields.name.trim()}
            onPress={() => dispatch({ type: "name", name: fields.name })}
          >
            Save profile
          </Button>
          <Card>
            <Text>Daily practice: {state.completed ? "Complete" : "Ready when you are"}</Text>
            <Text>Next session: {state.booking || "Not booked"}</Text>
          </Card>
          <Button onPress={() => go("mobile-settings")}>Open settings</Button>
        </>
      );
      break;
    case "mobile-settings":
      content = (
        <>
          <Title>Make yourself at home.</Title>
          <Toggle label="Dark appearance" value={dark} onChange={onDarkChange} />
          <Toggle
            label="Demo notifications"
            value={state.notifications}
            onChange={() => dispatch({ type: "notifications" })}
          />
          <Text>Notification preference is local; device permissions are not requested.</Text>
          <Card>
            <Title>Your demo data</Title>
            <Text>Changes last until this preview is reset or closed.</Text>
            <Button onPress={() => setReset(true)}>Reset demo</Button>
            {reset && (
              <>
                <Text>Restore the sample profile, bag and messages?</Text>
                <Button
                  onPress={() => {
                    dispatch({ type: "reset" });
                    setFields((old) => ({
                      ...old,
                      name: "Alex Morgan",
                      email: "",
                      password: "",
                      address: "",
                      message: "",
                    }));
                    setReset(false);
                  }}
                >
                  Confirm reset
                </Button>
                <Button onPress={() => setReset(false)}>Cancel reset</Button>
              </>
            )}
          </Card>
          <Button onPress={() => go("mobile-onboarding")}>View onboarding</Button>
        </>
      );
      break;
  }
  return (
    <Stack>
      <Text>DAYLIGHT / LOCAL DEMO</Text>
      <Button
        onPress={() => {
          setError("");
          dispatch({ type: "back" });
        }}
      >
        Back
      </Button>
      {content}
      {error && <Status error>{error}</Status>}
      {state.notice && <Status>{state.notice}</Status>}
      <Navigation
        items={[
          { id: "mobile-home", label: "Home" },
          { id: "mobile-search", label: "Discover" },
          { id: "mobile-cart", label: "Bag" },
          { id: "mobile-activity", label: "Activity" },
          { id: "mobile-profile", label: "Profile" },
        ]}
        active={state.screen}
        onChange={go}
      />
    </Stack>
  );
}
