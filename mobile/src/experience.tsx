import { Children, createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import catalog from "../generated/catalog.json";
import { MobileFlow, type MobileKit } from "../generated/experience";
import type { ScreenId } from "../generated/state";

export type NativeConfig = {
  screen: ScreenId;
  style: string;
  theme: string;
  motion: string;
  mode: "light" | "dark";
};
export function resolveNativeDesign(config: NativeConfig) {
  const theme = catalog.themes.find((item) => item.id === config.theme);
  const style = catalog.styles.find((item) => item.id === config.style);
  const motion = catalog.motions.find((item) => item.id === config.motion);
  if (!theme || !style || !motion || !catalog.screens.some((item) => item.id === config.screen))
    throw new Error("Unknown mobile design ID.");
  return { colors: theme[config.mode], style, motion };
}
type Design = ReturnType<typeof resolveNativeDesign>;
const Context = createContext<Design | null>(null);
function useDesign() {
  const design = useContext(Context);
  if (!design) throw new Error("NativeDesignProvider is required.");
  return design;
}
export function NativeDesignProvider({
  config,
  children,
}: {
  config: NativeConfig;
  children: ReactNode;
}) {
  return <Context.Provider value={resolveNativeDesign(config)}>{children}</Context.Provider>;
}
const spacing = StyleSheet.create({
  stack: { gap: 16, width: "100%" },
  card: { gap: 12, padding: 18, borderWidth: 1 },
  button: { minHeight: 48, padding: 12, alignItems: "center", justifyContent: "center" },
  field: { minHeight: 48, padding: 12, borderWidth: 1, fontSize: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 48,
  },
});
export const nativeKit: MobileKit = {
  Navigation: function Navigation({ items, active, onChange }) {
    const { colors } = useDesign();
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          borderTopWidth: 1,
          borderColor: colors.border,
          paddingTop: 12,
        }}
      >
        {items.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: active === item.id }}
            onPress={() => onChange(item.id)}
            style={{
              flexGrow: 1,
              flexBasis: 54,
              minHeight: 48,
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              backgroundColor: active === item.id ? colors.selected : colors.background,
            }}
          >
            <Text style={{ color: colors.foreground, fontSize: 12 }}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    );
  },
  Stack: ({ children }) => {
    const elements = Children.toArray(children);
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[spacing.stack, { paddingBottom: 24 }]}
        >
          {elements.slice(0, -1)}
        </ScrollView>
        {elements.at(-1)}
      </View>
    );
  },
  Card: function Card({ children }) {
    const { colors, style } = useDesign();
    return (
      <View
        style={[
          spacing.card,
          {
            borderColor: colors.border,
            borderRadius: style.radius,
            backgroundColor: colors.card,
            padding: 18 * style.density,
            borderWidth: style.borderWidth,
          },
        ]}
      >
        {children}
      </View>
    );
  },
  Title: function Title({ children }) {
    const { colors, style } = useDesign();
    return (
      <Text
        accessibilityRole="header"
        style={{
          color: colors.foreground,
          fontSize: 28 * style.headingScale,
          fontWeight: "700",
          letterSpacing: -0.8,
          flexShrink: 1,
        }}
      >
        {children}
      </Text>
    );
  },
  Text: function Body({ children }) {
    const { colors } = useDesign();
    return (
      <Text style={{ color: colors.foreground, fontSize: 15, lineHeight: 24, flexShrink: 1 }}>
        {children}
      </Text>
    );
  },
  Art: function Art({ children }) {
    const { colors, style } = useDesign();
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          minHeight: 150,
          backgroundColor: colors.accent,
          borderRadius: style.radius,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 80, color: colors.primary }}>{children}</Text>
      </View>
    );
  },
  Button: function Button({ children, onPress, disabled, selected }) {
    const { colors, style } = useDesign();
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled, selected }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          spacing.button,
          {
            borderRadius: style.radius,
            backgroundColor: selected ? colors.secondary : colors.primary,
            opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
          },
        ]}
      >
        <Text
          style={{
            color: selected ? colors["secondary-foreground"] : colors["primary-foreground"],
            textAlign: "center",
            fontWeight: "600",
            fontSize: 15,
          }}
        >
          {children}
        </Text>
      </Pressable>
    );
  },
  Field: function Field({ label, value, onChange, secure, email }) {
    const { colors, style } = useDesign();
    return (
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.foreground }}>{label}</Text>
        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={onChange}
          secureTextEntry={secure}
          keyboardType={email ? "email-address" : "default"}
          autoCapitalize={email || secure ? "none" : "sentences"}
          autoCorrect={!secure && !email}
          maxLength={label === "Message" ? 2000 : 200}
          selectionColor={colors.primary}
          style={[
            spacing.field,
            {
              color: colors.foreground,
              borderColor: colors.input,
              borderRadius: style.radius,
              backgroundColor: colors.background,
            },
          ]}
        />
      </View>
    );
  },
  Choice: function Choice({ label, value, options, onChange }) {
    const [open, setOpen] = useState(false);
    const { colors } = useDesign();
    return (
      <View style={{ gap: 8 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label + ": " + value}
          accessibilityState={{ expanded: open }}
          onPress={() => setOpen(!open)}
          style={[spacing.field, { borderColor: colors.border, backgroundColor: colors.card }]}
        >
          <Text style={{ color: colors.foreground }}>
            {label}: {value} {open ? "−" : "+"}
          </Text>
        </Pressable>
        {open && (
          <View accessibilityRole="radiogroup" style={{ gap: 4 }}>
            {options.map((option) => (
              <Pressable
                key={option}
                accessibilityRole="radio"
                accessibilityState={{ checked: option === value }}
                onPress={() => {
                  onChange(option);
                  setOpen(false);
                }}
                style={[
                  spacing.button,
                  { backgroundColor: value === option ? colors.selected : colors.card },
                ]}
              >
                <Text style={{ color: colors.foreground }}>{option}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  },
  Toggle: function Toggle({ label, value, onChange }) {
    const { colors } = useDesign();
    return (
      <View style={spacing.row}>
        <Text style={{ color: colors.foreground, flex: 1 }}>{label}</Text>
        <Switch
          accessibilityLabel={label}
          value={value}
          onValueChange={onChange}
          trackColor={{ true: colors.primary }}
        />
      </View>
    );
  },
  Status: function Status({ children, error }) {
    const { colors } = useDesign();
    return (
      <Text
        accessibilityRole={error ? "alert" : undefined}
        accessibilityLiveRegion="polite"
        style={{ color: error ? colors.destructive : colors.success, fontSize: 15, lineHeight: 24 }}
      >
        {children}
      </Text>
    );
  },
};

export function NativeExperience({
  config,
  onDarkChange,
}: {
  config: NativeConfig;
  onDarkChange: () => void;
}) {
  const { motion } = useDesign();
  const [opacity] = useState(() => new Animated.Value(1));
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let alive = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (alive) setReduced(value);
    });
    const listener = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduced);
    return () => {
      alive = false;
      listener.remove();
    };
  }, []);
  useEffect(() => {
    if (reduced || motion.id === "no-motion") {
      opacity.setValue(1);
      return;
    }
    opacity.setValue(0);
    const animation = Animated.timing(opacity, {
      toValue: 1,
      duration: motion.duration * 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: Platform.OS !== "web",
    });
    animation.start();
    return () => animation.stop();
  }, [config.screen, motion.duration, motion.id, reduced, opacity]);
  return (
    <Animated.View style={{ opacity, flex: 1 }}>
      <MobileFlow
        key={config.screen}
        kit={nativeKit}
        initialScreen={config.screen}
        dark={config.mode === "dark"}
        onDarkChange={onDarkChange}
      />
    </Animated.View>
  );
}
