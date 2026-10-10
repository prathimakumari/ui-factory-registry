import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, ScrollView, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import catalog from "./generated/catalog.json";
import {
  NativeDesignProvider,
  NativeExperience,
  nativeKit,
  resolveNativeDesign,
  type NativeConfig,
} from "./src/experience";
import type { ScreenId } from "./generated/state";

export default function App() {
  const [config, setConfig] = useState<NativeConfig>({
    screen: "mobile-home",
    style: "modern-minimal",
    theme: "emerald",
    motion: "subtle",
    mode: "light",
  });
  const [controls, setControls] = useState(false);
  const { colors } = resolveNativeDesign(config);
  const { Button, Choice, Title, Text } = nativeKit;
  return (
    <SafeAreaProvider>
      <NativeDesignProvider config={config}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <StatusBar style={config.mode === "dark" ? "light" : "dark"} />
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                maxWidth: 720,
                gap: 20,
                padding: 20,
                alignSelf: "center",
              }}
            >
              <Button onPress={() => setControls(true)}>Design controls</Button>
              <NativeExperience
                config={config}
                onDarkChange={() =>
                  setConfig((old) => ({ ...old, mode: old.mode === "light" ? "dark" : "light" }))
                }
              />
            </View>
          </KeyboardAvoidingView>
          <Modal visible={controls} animationType="none" onRequestClose={() => setControls(false)}>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
              <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
                <Title>Your mobile design library</Title>
                <Text>12 screens · 20 style adaptations · 24 themes</Text>
                <Choice
                  label="Screen"
                  value={catalog.screens.find((s) => s.id === config.screen)!.name}
                  options={catalog.screens.map((s) => s.name)}
                  onChange={(name) => {
                    const screen = catalog.screens.find((s) => s.name === name)!;
                    setConfig((old) => ({
                      ...old,
                      screen: screen.id as ScreenId,
                      style: screen.defaultStyle,
                      theme: screen.defaultTheme,
                      motion: screen.defaultMotion,
                    }));
                  }}
                />
                {(
                  [
                    ["style", catalog.styles],
                    ["theme", catalog.themes],
                    ["motion", catalog.motions],
                  ] as const
                ).map(([key, entries]) => (
                  <Choice
                    key={key}
                    label={key}
                    value={entries.find((s) => s.id === config[key])!.name}
                    options={entries.map((s) => s.name)}
                    onChange={(name) =>
                      setConfig((old) => ({
                        ...old,
                        [key]: entries.find((s) => s.name === name)!.id,
                      }))
                    }
                  />
                ))}
                <Button onPress={() => setControls(false)}>View design</Button>
              </ScrollView>
            </SafeAreaView>
          </Modal>
        </SafeAreaView>
      </NativeDesignProvider>
    </SafeAreaProvider>
  );
}
