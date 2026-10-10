# Our design system, implemented patterns, and external skills

Inspected on 2026-10-10. This document separates implemented source from optional future improvements.

## 1. Can we combine this registry with emilkowalski/skills?

**Yes. Use this registry as the source of reusable implementations and the external skills as task-specific design guidance.** That combination can improve consistency, interaction decisions and review quality. It does not automatically invent good designs, install UI libraries, or prove accessibility.

| Layer                    | Responsibility                                                     |
| ------------------------ | ------------------------------------------------------------------ |
| Your product brief       | Audience, platform, content, tasks and business behavior           |
| This registry            | Components, templates, tokens, IDs, reusable source and validation |
| Relevant installed skill | Guidance for a particular design, animation or review task         |
| Preview and tests        | Evidence that the resulting implementation works                   |
| Human review             | Whether the design suits the product and its users                 |

For example, an agent can start with `saas-landing-01`, reuse its sections, explore a new style with design guidance, and add a style manifest after comparison. The skill should help improve the implementation while preserving the registry's reusable structure.

The upstream repository supplies agent instructions. Its install command is:

```powershell
npx skills@latest add emilkowalski/skills
```

Run it when you want to install those instructions, select the intended agent and skills if prompted, and confirm that your agent exposes them afterward. Installing skills is separate from adding runtime packages. This documentation change did not install or invoke the upstream skills. [Upstream README](https://github.com/emilkowalski/skills#readme).

## 2. What design architecture do we follow?

We use **composition, semantic tokens, explicit configuration and platform adapters**. We do not claim to be a complete implementation of Material Design, Apple's Human Interface Guidelines, or every third-party design system.

| Implemented principle              | How it works                                                                                                             | Source                                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Separate structure from appearance | Templates choose sections; styles control visual treatment; themes control colors; motion profiles control animation     | `registry/schema.ts`, `lib/template-renderer.tsx`                                                 |
| Compose reusable pieces            | Primitives form sections; sections form pages; dashboard shells host domain views                                        | `components/ui/`, `components/sections/`, `components/dashboards/`, `lib/section-map.tsx`         |
| Stable discovery IDs               | Each registered item has an ID, version, source paths and dependency metadata                                            | `registry/*/*.json`, `registry/index.json`                                                        |
| Validate before rendering/export   | Zod schemas and reference checks reject unsupported IDs and incompatible selections                                      | `registry/schema.ts`, `lib/registry.ts`, `scripts/validate-registry.ts`                           |
| Semantic colors                    | Components use roles such as primary, destructive, border and foreground instead of copying a palette into each template | `lib/theme.ts`, `registry/themes/`, `styles/globals.css`                                          |
| Independent visual styles          | Typography, density, corners, borders, surfaces, backgrounds and controls are configurable                               | `registry/styles/`, `lib/theme.ts`                                                                |
| Controlled component variants      | Shared buttons and other primitives expose explicit variants instead of one-off copies                                   | `components/ui/button.tsx`, `components/ui/primitives.tsx`                                        |
| Container responsiveness           | Template layouts respond to their embedding container; preview dimensions are adjustable                                 | `styles/globals.css`, `lib/template-renderer.tsx`, `docs/flexible-designs.md`                     |
| Shared animation policy            | Motion profiles feed reusable primitives; reduced-motion settings and `no-motion` suppress optional movement             | `lib/motion.ts`, `components/motion/`                                                             |
| Theme propagation into portals     | Dialogs, tooltips and menus receive the active preview's theme variables                                                 | `components/ui/theme-scope.tsx`, `components/ui/primitives.tsx`                                   |
| Platform-specific rendering        | Mobile flow and state are shared; DOM controls and React Native controls are separate adapters                           | `registry/mobile/experience.tsx`, `components/mobile/experience.tsx`, `mobile/src/experience.tsx` |
| Keep business services separate    | Sample UI uses local state; real auth, payments, APIs and persistence belong in application adapters                     | Template components, `registry/mobile/state.ts`                                                   |

The primitives → sections → templates structure resembles the useful parts of atomic design. We do not enforce an atoms/molecules/organisms naming taxonomy. The mobile `MobileKit` is dependency injection: a shared screen flow receives a platform's controls. Its reducer centralizes state transitions; it is not a full routing or persistence framework.

## 3. What is implemented in the catalog?

| Catalog                     | Current scope                               | Preview                 |
| --------------------------- | ------------------------------------------- | ----------------------- |
| Website/dashboard templates | 50 compositions                             | `/registry`             |
| Visual styles               | 20 profiles                                 | `/styles`               |
| Themes                      | 24 palettes, each with light/dark tokens    | `/themes`               |
| Motion                      | 16 profiles and shared animation primitives | `/motion`               |
| UI components               | 35 entries                                  | `/components`           |
| Sections                    | 125 entries                                 | `/components`           |
| Mobile app screens          | 12 shared flows, with web and native kits   | `/mobile`, Expo starter |

The existing style IDs are:

```text
modern-minimal       corporate-enterprise  glassmorphism
neo-brutalism        luxury-premium        editorial-magazine
swiss-grid           soft-ui               dark-cinematic
cyberpunk            retro-arcade          playful-friendly
organic-natural     gradient-tech         monochrome
bento-modern        industrial            warm-human
futuristic-spatial   creative-expressive
```

These profiles can change the same template. A new color combination is usually a theme; a new layout is a template or section; a new reusable visual treatment is a style. Use the appropriate layer instead of duplicating a whole page.

Registered component IDs:

```text
ui-accordion       ui-alert           ui-avatar          ui-badge
ui-border-glow     ui-breadcrumbs     ui-button          ui-card
ui-chart           ui-checkbox       ui-command-menu    ui-data-table
ui-dialog          ui-drawer         ui-dropdown-menu   ui-empty-state
ui-form-field      ui-input          ui-label           ui-link
ui-loading         ui-metallic-button ui-pagination     ui-popover
ui-progress        ui-radio          ui-select          ui-separator
ui-skeleton        ui-status-orb     ui-switch          ui-tabs
ui-textarea        ui-toast          ui-tooltip
```

For actual exports, props and source files, inspect the matching manifest in `registry/components/`. Counts describe available entries, not universal coverage of every UI pattern. See the generated [template catalog](template-catalog.md), [theme catalog](theme-catalog.md) and [mobile guide](mobile-designs.md).

## 4. Sonner, toast notifications, dialogs and form errors

**Sonner is not a dependency in either current application package.** We currently register our own `ui-toast`, exported as `Toast` from `components/ui/primitives.tsx`.

| Feature                                          | Current implementation                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------- |
| Basic toast                                      | Message, status announcement, dismiss button, five-second timeout               |
| Sonner package                                   | Not integrated                                                                  |
| Sonner `Toaster` / `toast()` API                 | Not present                                                                     |
| Promise/loading-to-success toast lifecycle       | Not provided by the current toast API                                           |
| Queue, stacked toast management, swipe dismissal | Not provided by the current toast component                                     |
| Inline alerts                                    | `Alert` uses status/alert roles with visual variants                            |
| Form field errors                                | `FormField` associates labels and error descriptions and marks invalid controls |
| Tooltips, dialogs and dropdowns                  | Radix-backed wrappers with themed portals                                       |
| Drawer                                           | A drawer presentation of the dialog wrapper; not a native gesture-driven sheet  |
| Mobile feedback                                  | Shared status/error messages rendered by each platform's kit                    |

Sonner is a React toast library with notification types, actions, promise handling and positioning. The upstream `ask-sonner` skill explains how to use that library; the skill itself is not the library. [Sonner](https://sonner.emilkowal.ski/), [ask-sonner source](https://github.com/emilkowalski/skills/blob/main/skills/ask-sonner/SKILL.md).

### Would adding Sonner help?

My recommendation: keep the existing basic toast for simple demonstrations. Consider a Sonner adapter for a real web application that needs queued notifications, upload/save promise states or undo actions. Use inline errors for required field corrections; a disappearing toast should not be the only explanation of a failed form.

If you decide to integrate it later, give the agent this task:

```text
Add a Sonner-based web notification adapter to UI Factory Registry.
Use the installed ask-sonner skill if it is available.
Inspect ui-toast and its callers first. Preserve their behavior or document migration.
Check current Sonner compatibility, then pin the dependency and update the lockfile.
Keep one clear notification API and avoid duplicate rendering hosts.
Map theme tokens and current preview mode, including portal boundaries.
Register actual source and dependencies; update source export metadata.
Demonstrate success, error, loading/promise, action and dismiss behavior.
Test keyboard access, layering with dialogs, narrow containers and reduced motion.
Do not import the browser library into the native kit; handle that platform separately.
```

This is a proposed enhancement, not completed integration. Inspect the current version before adding it:

```powershell
pnpm view sonner version peerDependencies
```

## 5. Accessibility and interaction principles already represented

- Semantic buttons, links, inputs and associated field labels.
- Explicit submit buttons in forms; reusable buttons default to `type="button"`.
- Keyboard-aware Radix interactions, visible focus styling, and close/dismiss controls.
- Error/status announcements and preserved `aria-describedby` relationships in `FormField`.
- Light/dark semantic tokens and automated checks of selected contrast pairs.
- Reduced motion and optional decorative effects that can be paused.
- Empty, loading, skeleton, error and success patterns available for reuse.
- Container-width checks for every website template; adjustable content width, density and radius.
- Mobile web inputs at readable sizes; native safe-area and keyboard wrappers; visible native bottom navigation.

These are source capabilities, not a certification that every consuming application meets every accessibility requirement. Real text, validation rules, translations and data can introduce new failures. Test the actual application, not only a sample component.

The latest recorded checks include 255 unit tests, 126 website Chromium tests, two Expo web tests and native bundle generation. See [implementation status](implementation-status.md) for scope. No physical-device testing or complete accessibility audit is claimed.

## 6. Which external skills should we use?

Choose a small relevant set for the task:

| Task                                   | Candidate upstream skill       |
| -------------------------------------- | ------------------------------ |
| Design engineering guidance            | `emil-design-eng`              |
| Compare alternative interface concepts | `prototype`                    |
| Create or review web animation         | `animate`, `review-animations` |
| Stress-test awkward content            | `break-ui`                     |
| Phone-friendly web behavior            | `mobile-native`                |
| Native Expo animation work             | `animate-expo`                 |
| Sonner integration                     | `ask-sonner`                   |

These names and purposes come from the [upstream skill index](https://github.com/emilkowalski/skills#reference). In particular, `mobile-native` refers to mobile web guidance; it does not convert web components into React Native.

Do not activate every skill for every task. First inspect what exists. A suggestion to choose a different UI library is not, by itself, a reason to replace the registry's working primitives. Evaluate the concrete missing capability, migration cost and platform support.

## 7. Repeatable workflow for inventing a style

1. Write a brief: audience, main task, platform, content, desired character and constraints.
2. Search existing styles and templates. Identify what cannot be expressed by existing settings.
3. Ask the relevant installed skill for guidance or concept alternatives. Keep components and content comparable so visual differences are meaningful.
4. Decide which layer changes: theme, style, motion, section, template or platform adapter.
5. Implement the smallest reusable addition. For a new style, create `registry/styles/<id>.json`; implement any required CSS treatments. A JSON name alone does not produce a new visual treatment.
6. If the style needs a new enum value, update its schema and CSS together. Update template compatibility lists so the intended templates can select it. Keep defaults deliberate.
7. Inspect the same buttons, form, cards, navigation and page composition in the new style. Check long text, errors, empty states, dark mode, narrow containers and reduced motion.
8. If native support is required, implement the corresponding native adaptation explicitly. Regenerating tokens alone does not reproduce a new CSS effect on native views.
9. Update manifests, versions, dependencies and docs; regenerate; run the relevant checks.
10. Keep the design only when it offers a useful distinction and works with actual content.

```powershell
pnpm registry:list --kind style
pnpm registry:list --kind component
pnpm registry:sync-dependencies
pnpm registry:generate
pnpm registry:validate
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

For native changes, also follow the checks in [mobile-designs.md](mobile-designs.md). For installable web registry artifacts, run `pnpm registry:build` after source changes.

### Reusable request for an existing template

```text
Use my UI Factory Registry as the implementation foundation.
Read AGENTS.md, docs/agent-usage.md and docs/design-principles-and-skills.md.
Template: saas-landing-01
Current style: modern-minimal
Theme: ocean-blue
Motion: subtle

Goal: [describe the users, task and visual direction].
Use the relevant installed emilkowalski skill for this task, if available.
If it is unavailable, report that and continue using the registry guidance.
Inspect and reuse the existing components before introducing anything.
Explain whether this needs a new theme, style, section or template.
Keep behavior, structure, tokens and motion separate.
Add a stable registry entry for a genuinely reusable new treatment.
Verify forms, focus, feedback, dark mode, narrow containers and reduced motion.
Report the reused IDs, changed files, checks and remaining limitations.
```

For a mobile task, replace the template with a screen ID and specify **mobile web**, **React Native**, or **both**. An installed skill is not guaranteed to run just because it exists; explicitly name the relevant skill in the task when you want its guidance.

## 8. What combining them will not supply automatically

Backend authentication, authorization, database persistence, payments, notifications, native production navigation, localization, device haptics and advanced native gesture/sheet implementations still need application work. Nor does installation import all designs from the author's projects.

The useful combination is a disciplined workflow: reuse known source, apply targeted guidance, make a concrete improvement, then validate it. See [extension guide](extension-guide.md) and [how to run](../HOW-TO-USE.md).
