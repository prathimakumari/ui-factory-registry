# Dependency verification

Initialized on 2026-10-09. Official documentation and live package metadata were checked before installation.

- Next.js 16.4.0, App Router: https://nextjs.org/docs/app/getting-started/installation
- React / React DOM 19.3.0, matching versions.
- Tailwind CSS / PostCSS plugin 4.3.3: https://tailwindcss.com/docs/installation/framework-guides/nextjs and https://tailwindcss.com/docs/theme
- Motion 14.0.0 with motion/react imports: https://motion.dev/docs/react-installation
- shadcn 4.21.4: official registry schemas and CLI. Button was fetched using shadcn add button, then adapted to semantic CSS classes while retaining Radix Slot and CVA API.
- Zod 4.6.5, Lucide React 1.53.0, Radix UI 1.7.0.
- Vitest 5.0.3 and Playwright 1.64.0.
- pnpm 12.10.1: configuration uses pnpm-workspace.yaml. https://pnpm.io/settings

## Compatibility choices

The latest standalone ESLint was 10.12.0, but Next's installed import/react/accessibility lint plugins declare support only through ESLint 9. The newest compatible 9.x release, 9.39.5, is used.

The latest standalone TypeScript was 7.0.2, but typescript-eslint 8.71.1 requires TypeScript below 6.1. The newest compatible 6.0 release, 6.0.3, is used.

These are intentional compatibility constraints, not arbitrary version downgrades. package.json and pnpm-lock.yaml pin the resolved set. Run pnpm peers check when updating.

## Build scripts

Only the required esbuild and unrs-resolver install/build scripts are allowed. No analytics, payment, database, auth or charting service dependency is present. Charts use accessible local SVG and data tables.

## Independent native starter — 2026-10-10

`mobile/` uses its own pnpm workspace and lockfile. Stable Expo package metadata and the published blank TypeScript template were checked before installation: Expo 57.0.27, React/React DOM 19.2.3, React Native 0.86.3 and expo-status-bar 57.0.1. The root web application retains its separate React version.

`expo install` selected react-native-safe-area-context 5.7.0, react-native-web 0.21.4 and @expo/metro-runtime 57.0.16. A compatibility check identified the template's older React types; these were updated to the SDK-recommended `~19.2.4` range (lockfile resolves 19.2.18). The final `pnpm exec expo install --check` passed. See [Expo environment setup](https://docs.expo.dev/get-started/set-up-your-environment/) before running a device or emulator.

Native source passed TypeScript checking and web/Android/iOS bundle generation locally. No native store build, signing or deployment was performed.
