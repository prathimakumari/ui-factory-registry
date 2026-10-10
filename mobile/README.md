# UI Factory Mobile

Independent Expo/React Native starter with 12 demo screens, 20 portable style adaptations and 24 light/dark themes.

```powershell
pnpm install --frozen-lockfile
pnpm start
```

Use `pnpm web` for a browser preview, `pnpm android` for a configured Android device/emulator, or `pnpm ios` for an iOS simulator on macOS. Open **Design controls** to select a screen and appearance. Stop the server with Ctrl+C.

`pnpm typecheck`, `pnpm export:web` and `pnpm export:native` check TypeScript and create bundles. Native export does not create a signed store application. Test physical devices separately.

`generated/` contains copies of shared catalog data and flow source. In the original parent repository run `pnpm mobile:generate` after editing `registry/mobile/`. A copied standalone starter can edit its generated files directly, but those edits will be overwritten if you regenerate from the original repository.

Keep this package's own React and Expo versions and lockfile. To reuse it elsewhere copy this directory without `node_modules`, `.expo`, `dist` or `dist-native`, then install dependencies. No parent files are needed at runtime.

App state stays in memory. Forms, checkout, messaging and booking are demonstrations, with no backend or payment integration. The on-screen Back button handles demo navigation; integrate a production native router for your application. Native styles adapt shared tokens, not all CSS effects. Native motion is an entrance fade with reduced-motion support.
