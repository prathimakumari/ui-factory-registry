# Mobile application designs

The catalog contains **12 connected demo screens**, with separate web and React Native controls. It covers common app flows; it does not contain every possible industry design, authentication service, payment processor or backend.

## Preview mobile web

From the repository root:

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000/mobile. Select **Mobile screen**, **Mobile style**, **Mobile theme**, **Mobile motion**, dark appearance and preview width. The preview shrinks to its parent, even when the selected width exceeds the available space. Changing the catalog screen resets its demo state and loads its recommended style/theme/motion. Changing appearance preserves the current flow.

Use the navigation inside the preview to keep your cart, profile and messages while moving between screens. Export config downloads the selected starting screen and design IDs, not customer data or your current navigation history.

## Run the native starter

Run generation from the repository root, then enter the independent native package:

```powershell
pnpm mobile:generate
cd mobile
pnpm install --frozen-lockfile
pnpm start
```

Follow the Expo terminal instructions to open the project on a compatible device or emulator. Your device must be able to reach the development server. Install the matching Expo Go version or use a development build as required by your device and Expo SDK. See [Expo's official environment guide](https://docs.expo.dev/get-started/set-up-your-environment/).

Other commands, run **inside `mobile/`**:

```powershell
pnpm web            # React Native Web preview
pnpm android        # requires configured Android emulator/device
pnpm ios            # requires macOS and Xcode for the iOS simulator
pnpm typecheck
pnpm export:web     # static browser bundle in dist/
pnpm export:native  # Android/iOS bundles in dist-native/; not signed binaries
```

Windows cannot run the iOS simulator. Native bundle generation and a browser preview do not establish correct behavior on a physical device. Check keyboard avoidance, screen readers, font scaling, gestures, safe areas and orientation on your target devices before shipping.

Use **Design controls** in the starter to select screens and tokens. The native package has its own dependency versions and lockfile. Keep its Expo-compatible React version; do not replace it with the web registry's React version. The versions follow the [Expo blank TypeScript starter](https://github.com/expo/expo/tree/main/templates/expo-template-blank-typescript), with compatible packages installed through `expo install`.

## Screen IDs

| ID                  | Demonstrated behavior                                                 |
| ------------------- | --------------------------------------------------------------------- |
| `mobile-onboarding` | Three steps, skip and sign-in navigation                              |
| `mobile-sign-in`    | Email/password validation and local session flag                      |
| `mobile-home`       | Daily practice, products, booking and messages                        |
| `mobile-search`     | Search, category filter and empty results                             |
| `mobile-product`    | Product details, finish selection and add to bag                      |
| `mobile-cart`       | Variant quantities, removal, empty bag and computed subtotal          |
| `mobile-checkout`   | Required delivery fields and local order confirmation                 |
| `mobile-activity`   | Unread filter, mark read and message navigation                       |
| `mobile-messages`   | Conversation and local message composer                               |
| `mobile-booking`    | Service, sample date/time and local confirmation                      |
| `mobile-profile`    | Display-name editing and practice/booking summary                     |
| `mobile-settings`   | Dark appearance, local notification preference and reset confirmation |

## Source and reuse

```text
registry/mobile/screens.json     Screen descriptions and defaults
registry/mobile/data.json        Fictional content
registry/mobile/state.ts         Shared reducer and validation
registry/mobile/experience.tsx   Shared flow with injected control kit
components/mobile/experience.tsx Web kit: DOM inputs, buttons, navigation
components/mobile/studio.tsx     Web renderer and catalog controls
styles/mobile.css               Responsive mobile web styling
mobile/src/experience.tsx        Native kit and token adapter
mobile/App.tsx                   Expo entry UI, safe areas and design controls
mobile/generated/               Generated standalone copies; do not edit
```

Discover screens using `pnpm registry:list --kind mobile-screen`. The compact `registry/index.json` includes `mobileScreens` separately from website templates. Mobile screen IDs are not accepted by the website template export command or the shadcn template endpoint.

To reuse the native starter, copy `mobile/` including `generated/`, `src/`, `App.tsx`, `index.ts`, configuration and its lockfile. Exclude `node_modules/`, `.expo/`, `dist/` and `dist-native/`; install dependencies in the new location. It has no runtime imports from the parent registry.

For reuse within this web repository, import `MobileRenderer` from `components/mobile/studio.tsx`, provide a validated `MobileConfig`, and supply `onDarkChange` to update its mode. For a different web repository, copy the shared mobile sources and the web renderer/kit plus their transitive dependencies, including tokens, ThemeScope, MotionProvider, Button and styles. The existing template copy exporter does not package mobile screens automatically.

Both kits use the same interaction logic. To add a screen, extend `ScreenId`, the catalog and `MobileFlow`; add only genuinely missing controls to both kits, regenerate, and test both platforms. Connect real APIs, routing, persistence and validation in the consuming application. The starter currently uses in-memory navigation, including an on-screen Back button, rather than a production navigation/router integration.

## Design flexibility and limits

Web previews apply all 20 style profiles, 24 themes and 16 motion profiles using existing registry tokens. The native adapter uses theme colors and style radius, density, heading scale and border width. It uses system fonts and native controls; CSS gradients, shadows, glass effects and other browser treatments are not reproduced identically. Native motion uses the selected duration for an entrance fade, with a no-motion option and system reduced-motion support; it does not reproduce every web animation effect.

Layout fills the available width with a maximum native content width of 720. Web previews can test widths from 320 to 840 and shrink further when embedded. Controls have at least 44px web / 48 native layout-unit button heights. Native text can scale with device settings. Test unusually long translations and your real content when adapting these screens.

All authentication, orders, messages, bookings and notification settings are local demos. Reloading or choosing another catalog screen resets state. Use fictional form values. No payment, message or reservation is submitted.

For the main application and website styles, start with [HOW-TO-USE.md](../HOW-TO-USE.md).

## Reproduce the browser checks

After `pnpm build`, run `pnpm test:e2e` from the root for the website suite. After `pnpm export:web` inside `mobile/`, return to the root and run `pnpm exec playwright test --config playwright.native.config.ts`. The latter serves the Expo web export on local port 3200 and tests the native control kit in Chromium. It does not launch an iOS or Android emulator.
