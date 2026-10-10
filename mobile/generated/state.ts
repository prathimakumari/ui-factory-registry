import data from "./data.json";
export const screenIds = [
  "mobile-onboarding",
  "mobile-sign-in",
  "mobile-home",
  "mobile-search",
  "mobile-product",
  "mobile-cart",
  "mobile-checkout",
  "mobile-activity",
  "mobile-messages",
  "mobile-booking",
  "mobile-profile",
  "mobile-settings",
] as const;
export type ScreenId = (typeof screenIds)[number];
export type CartLine = { productId: string; finish: string; quantity: number };
export type MobileState = {
  screen: ScreenId;
  history: ScreenId[];
  step: number;
  name: string;
  productId: string;
  cart: CartLine[];
  messages: { id: number; text: string; own: boolean }[];
  completed: boolean;
  read: boolean;
  notifications: boolean;
  signedIn: boolean;
  order: boolean;
  booking: string;
  notice: string;
};
export function initialMobileState(screen: ScreenId = "mobile-home"): MobileState {
  return {
    screen,
    history: [],
    step: 0,
    name: "Alex Morgan",
    productId: "bottle",
    cart: [
      { productId: "bottle", finish: "Natural", quantity: 1 },
      { productId: "notebook", finish: "Natural", quantity: 1 },
    ],
    messages: data.messages,
    completed: false,
    read: false,
    notifications: true,
    signedIn: false,
    order: false,
    booking: "",
    notice: "",
  };
}
export type MobileAction =
  | { type: "navigate"; screen: ScreenId }
  | { type: "back" }
  | { type: "next" }
  | { type: "product"; id: string }
  | { type: "add"; productId: string; finish: string; quantity: number }
  | { type: "quantity"; index: number; delta: number }
  | { type: "send"; text: string }
  | { type: "name"; name: string }
  | { type: "book"; service: string; day: string; time: string }
  | { type: "complete" | "read" | "notifications" | "sign-in" | "order" | "reset" };
function navigate(state: MobileState, screen: ScreenId): MobileState {
  return screen === state.screen
    ? state
    : { ...state, screen, history: [...state.history, state.screen].slice(-20), notice: "" };
}
export function mobileReducer(state: MobileState, action: MobileAction): MobileState {
  switch (action.type) {
    case "navigate":
      return navigate(state, action.screen);
    case "back":
      return {
        ...state,
        screen: state.history.at(-1) || "mobile-home",
        history: state.history.slice(0, -1),
        notice: "",
      };
    case "next":
      return state.step < 2
        ? { ...state, step: state.step + 1 }
        : navigate(state, "mobile-sign-in");
    case "product":
      return data.products.some((p) => p.id === action.id)
        ? navigate({ ...state, productId: action.id }, "mobile-product")
        : state;
    case "add": {
      if (
        !data.products.some((p) => p.id === action.productId) ||
        !data.finishes.includes(action.finish) ||
        !Number.isFinite(action.quantity)
      )
        return state;
      const quantity = Math.max(1, Math.min(99, Math.floor(action.quantity)));
      const existing = state.cart.findIndex(
        (line) => line.productId === action.productId && line.finish === action.finish,
      );
      const cart =
        existing < 0
          ? [...state.cart, { productId: action.productId, finish: action.finish, quantity }]
          : state.cart.map((line, i) =>
              i === existing ? { ...line, quantity: Math.min(99, line.quantity + quantity) } : line,
            );
      return { ...state, cart, order: false, notice: "Added to your bag." };
    }
    case "quantity":
      return {
        ...state,
        cart: state.cart
          .map((line, i) =>
            i === action.index
              ? {
                  ...line,
                  quantity: Math.max(0, Math.min(99, line.quantity + Math.sign(action.delta))),
                }
              : line,
          )
          .filter((line) => line.quantity > 0),
        order: false,
      };
    case "send":
      return action.text.trim()
        ? {
            ...state,
            messages: [
              ...state.messages,
              { id: state.messages.length + 1, text: action.text.trim().slice(0, 2000), own: true },
            ],
            notice: "Message added locally. Nothing was sent.",
          }
        : state;
    case "name":
      return action.name.trim()
        ? { ...state, name: action.name.trim().slice(0, 80), notice: "Profile updated locally." }
        : state;
    case "book":
      return data.services.some((s) => s.id === action.service) &&
        data.days.includes(action.day) &&
        data.times.includes(action.time)
        ? {
            ...state,
            booking:
              data.services.find((s) => s.id === action.service)!.name +
              " · " +
              action.day +
              " · " +
              action.time,
            notice: "Demo booking saved. No reservation was made.",
          }
        : state;
    case "complete":
      return { ...state, completed: !state.completed };
    case "read":
      return { ...state, read: true, notice: "All notifications marked as read." };
    case "notifications":
      return { ...state, notifications: !state.notifications };
    case "sign-in":
      return navigate({ ...state, signedIn: true }, "mobile-home");
    case "order":
      return state.cart.length
        ? { ...state, cart: [], order: true, notice: "Demo order confirmed. No payment was taken." }
        : state;
    case "reset":
      return initialMobileState("mobile-settings");
  }
}
export function cartTotal(cart: CartLine[]) {
  return cart.reduce(
    (total, line) =>
      total + (data.products.find((p) => p.id === line.productId)?.price || 0) * line.quantity,
    0,
  );
}
export function signInError(email: string, password: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
  if (password.length < 8) return "Use at least 8 characters for the demo password.";
  return "";
}
export function checkoutError(name: string, email: string, address: string) {
  if (!name.trim()) return "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address.";
  if (address.trim().length < 5) return "Enter a delivery address.";
  return "";
}
