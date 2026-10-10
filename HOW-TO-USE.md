# How to run and use UI Factory Registry

This is your local design library and preview application. Start the application to browse live designs; opening a Markdown file in the editor only shows documentation.

## 1. Start the website

Open the VS Code terminal in PowerShell and run:

```powershell
cd "C:\Users\Sartima kumari\Desktop\UI-templates\ui-factory-registry"
pnpm install --frozen-lockfile
pnpm dev
```

Dependencies are already installed on this machine. On subsequent runs, `pnpm dev` is enough. Keep that terminal running, then open **http://localhost:3000** in your browser. Press **Ctrl+C** in the terminal to stop it.

Requirements: Node.js 22.12 or newer and pnpm 12.10.1. Check with `node --version` and `pnpm --version`.

If PowerShell blocks `pnpm.ps1`, use `pnpm.cmd dev`. If pnpm is installed but not on PATH on this machine:

```powershell
& "$env:APPDATA\npm\pnpm.cmd" dev
```

If port 3000 is occupied:

```powershell
pnpm dev --port 3001
```

Then open http://localhost:3001 instead. Change the port in the links below accordingly.

## 2. Where to view everything

| What you want                                                      | Browser page                                  |
| ------------------------------------------------------------------ | --------------------------------------------- |
| All 50 website/dashboard templates                                 | http://localhost:3000/registry                |
| All 20 visual styles                                               | http://localhost:3000/styles                  |
| All 24 color themes, light and dark                                | http://localhost:3000/themes                  |
| Motion presets and animation controls                              | http://localhost:3000/motion                  |
| Buttons, tooltips, forms, dialogs, sections and decorative effects | http://localhost:3000/components              |
| Combine a template, style, theme, motion and dimensions            | http://localhost:3000/playground              |
| Mobile application screen catalog                                  | http://localhost:3000/mobile                  |
| One complete example                                               | http://localhost:3000/preview/saas-landing-01 |

### View different styles

Open `/styles` to compare the same sample interface in different visual languages. Use `/playground` to see a style applied to an entire template. Styles affect typography, spacing, corners, surfaces and controls; themes supply the colors.

Available style IDs:

```text
modern-minimal       corporate-enterprise  glassmorphism
neo-brutalism        luxury-premium        editorial-magazine
swiss-grid           soft-ui               dark-cinematic
cyberpunk            retro-arcade          playful-friendly
organic-natural     gradient-tech         monochrome
bento-modern        industrial            warm-human
futuristic-spatial   creative-expressive
```

In `/components`, choose a component family and variant, then change **Component style**, **Component theme**, **Component dark mode**, **Component motion**, and **Component width**. Try Border Glow, Status Orb and Metallic Button for configurable effects.

## 3. Create and save a design combination

1. Open `/playground` and choose a layout template.
2. Select a visual style, color theme and motion profile.
3. Try light/dark mode and compatible navbar, hero, feature and footer variants.
4. Use Desktop, Tablet or Mobile, or adjust custom preview width and height.
5. Adjust content width, spacing density and corner radius if needed.
6. Choose **Inspect code** to see the configuration and imports.
7. Choose **Export config** to download JSON, or **Copy agent prompt** to give the full configuration to your next coding agent.

Preview dimensions are a testing tool. A production design should adapt to its actual container. The optional `layout` configuration overrides content width, density and radius; it is preserved in exports.

## 4. Use a design in another web project

Run these commands **inside this registry repository**:

```powershell
pnpm registry:list --kind template
pnpm registry:list --kind style
pnpm registry:list --kind theme
pnpm registry:list --search pricing
pnpm registry:export --template saas-landing-01 --style modern-minimal --theme ocean-blue --motion premium-smooth --copy
```

The files are written to `exports/saas-landing-01/`. Read its `INTEGRATION.md`. Copy the supplied source directories and images into a compatible React project, install the packages listed in `dependencies.json`, configure the `@/*` alias, and include the Tailwind v4 stylesheet. The provided `page.tsx` is a Next.js example.

After integrating the source:

```tsx
import { TemplateRenderer } from "@/lib/template-renderer";
import "@/styles/globals.css";

export default function Page() {
  return (
    <TemplateRenderer
      config={{
        template: "saas-landing-01",
        style: "modern-minimal",
        theme: "ocean-blue",
        motion: "premium-smooth",
        layout: { contentWidth: 1120, density: 0.9, radius: 16 },
      }}
    />
  );
}
```

For a preview inside another application's panel, pass `embedded` and an optional `style={{ maxWidth: 640 }}`. Individual section imports are available when you only need one piece. See [local and shadcn integration](docs/registry-integration.md).

Example instruction for a future coding agent:

```text
Use my UI Factory Registry.
Read AGENTS.md, docs/agent-usage.md, and registry/index.json.
Template: saas-landing-01
Style: modern-minimal
Theme: ocean-blue
Motion: premium-smooth
Reuse existing registered source and semantic tokens.
Supply my content and application behavior.
Validate the configuration and test my actual responsive layout.
Do not recreate components already present in the registry.
```

## 5. What is emilkowalski/skills?

[emilkowalski/skills](https://github.com/emilkowalski/skills) provides instructions that help coding agents make design and animation decisions. It includes animation creation/review, UI stress testing, mobile web guidance and native animation guidance. It is a set of agent skills, rather than a gallery of finished application templates.

Examples include `emil-design-eng`, `animate`, `review-animations`, `break-ui`, `mobile-native` and `animate-expo`. The repository's README provides this optional installation command:

```powershell
npx skills@latest add emilkowalski/skills
```

Those external skills have not been installed by writing this guide. They can complement this registry: use the registry for implementation source and IDs, and a suitable installed skill for design review or improvements. Read the upstream instructions for the agent you use. [Upstream README](https://github.com/emilkowalski/skills#readme).

We have our own agent instructions, tokens, components, motion and validation, but do not claim to implement every practice or animation from that repository. Its [`mobile-native`](https://github.com/emilkowalski/skills/blob/main/skills/mobile-native/SKILL.md) concerns phone-friendly web behavior; [`animate-expo`](https://github.com/emilkowalski/skills/blob/main/skills/animate-expo/SKILL.md) addresses React Native/Expo animation.

## 6. Mobile web and native applications

There are three separate things to understand:

| Type                               | What it means here                                                                                                         |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Responsive website                 | Existing templates adapt to small browser/container widths.                                                                |
| Mobile application screens for web | `/mobile` previews reusable app screens, touch controls and bottom navigation.                                             |
| Native mobile application          | `mobile/` contains a separate Expo/React Native starter for iOS and Android. Its components use native views and controls. |

`mobile-app-promo` is a website for promoting an app. It is not the app's native source code.

The mobile screen catalog covers common flows: onboarding, sign-in, home, search, product details, cart, checkout, activity, messages, booking, profile and settings. This is a reusable starting catalog, not every possible mobile app or industry workflow. Web and native implementations share screen IDs and generated style/theme/motion data; platform-specific controls remain separate.

See [Mobile application designs](docs/mobile-designs.md) for screen IDs, native commands, source locations and verification limits.

To start the separate mobile app, run from the registry root:

```powershell
pnpm mobile:generate
cd mobile
pnpm install --frozen-lockfile
pnpm start
```

Use **Design controls** in the Expo starter to browse screens and styles. For its browser preview, run `pnpm web` inside `mobile/`. Follow the mobile guide for Android/iOS environment setup. Native styles adapt shared tokens and use system fonts; browser-specific effects are not identical on devices.

## 7. Validate or build

Run from the repository root:

```powershell
pnpm registry:validate
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
```

`pnpm start` serves the production build on port 3000. Stop the development server first, or choose another port. To run Chromium browser tests after building:

```powershell
pnpm exec playwright install chromium
pnpm test:e2e
```

The browser tests start their own server on port 3100. They do not verify physical phones, native device gestures or every custom content combination.

## 8. What to change, and what to keep

Supply real application content, validation rules, navigation, APIs and persistence in your consuming project. Demo forms, cart, bookings and messages use local state. Payments, authentication and real messaging services are not connected.

Edit source manifests and components; regenerate catalogs afterward. Keep stable IDs and reuse existing tokens and implementations. Follow [the extension guide](docs/extension-guide.md) when adding a genuinely new pattern.

Related documents: [README](README.md), [agent usage](docs/agent-usage.md), [flexible designs](docs/flexible-designs.md), [troubleshooting](docs/troubleshooting.md), [verification report](docs/implementation-status.md).
