# Flexible designs and optional effects

Templates respond to the width of their `.factory-preview` container using CSS container queries, including when a narrow panel sits inside a wide desktop browser. The supported audit range is 320–1440 CSS pixels. The playground offers 280–1920px preview controls for exploratory stress testing; arbitrary future content still needs inspection.

```tsx
<TemplateRenderer
  embedded
  className="my-preview"
  style={{ maxWidth: 640 }}
  config={{
    template: "saas-landing-01",
    style: "glassmorphism",
    theme: "royal-purple",
    motion: "premium-smooth",
    layout: { contentWidth: 960, density: 0.85, radius: 20 },
  }}
/>
```

`embedded` removes the full-viewport minimum height. `className` and `style` control the host element. Configuration `layout` overrides are validated: content width 320–1920px, density 0.6–1.6, radius 0–40px. Omitting a field keeps the selected style's value. Content width is a maximum, not a forced fixed width. These values survive JSON export and the full-preview link. Preview viewport width/height are testing controls and are not production layout constraints.

For individual sections, provide semantic theme/style variables, ThemeScope for portalled content, MotionProvider for Motion sections, and a `.factory-preview` ancestor. Tables may intentionally scroll inside their own region. Dialogs, tooltips, menus and popovers use viewport collision boundaries; they are not clipped to a card.

## Live component studio

`/components` lets you change the component style, theme, light/dark mode, motion profile and containing width. The three additional effects have controls and a copyable prompt with exact current props:

| ID                 | Export         | Controls                                                                     |
| ------------------ | -------------- | ---------------------------------------------------------------------------- |
| ui-border-glow     | BorderGlow     | speed, strength, active, className/style, child content                      |
| ui-status-orb      | StatusOrb      | idle/working/listening/complete/error, size, speed, paused, accessible label |
| ui-metallic-button | MetallicButton | normal Button props, active sheen, application callback                      |

Import them from `@/components/ui/effects` and include `styles/globals.css` (which imports `styles/effects.css`). These original CSS effects use the existing semantic palette, require no new runtime dependencies, and respect reduced motion. `data-motion="no-motion"` also disables their animation. Effects are optional: existing templates do not automatically receive decorative loops. Pause controls are available in the demos. Status orbs expose text status, not color alone. Button sheen works on keyboard focus as well as hover.

The workflow was informed by [Libraries.dev](https://libraries.dev/) and its configurable effects and agent prompts. This repository does not bundle their packages, paid assets, or proprietary source; these effects are separate implementations.

## Forms and reusable controls

Button defaults to `type="button"`; use `type="submit"` explicitly for submitting forms. Existing demo forms declare their submission actions. Disabled native buttons cannot invoke their action. FormField preserves the input's custom ID and help text IDs, associates an error description, and announces the error. Select and Switch preserve custom IDs while keeping labels connected.

Tooltips work with pointer and keyboard focus. Keep essential instructions visible or provide an accessible popover for touch users; do not put the only explanation in a hover tooltip. Supplying a tooltip never replaces the trigger's accessible name.

`/playground` provides **Copy agent prompt** with the complete validated configuration, import instructions, and responsive requirements. Copying a component or importing a template supplies design and local interactions; each consuming project still owns real application behavior and its own validation rules.

## Audit boundaries

Responsive checks measure actual container overflow without hiding it. Existing mobile tests also check full-document overflow. Browser tests cover defaults plus a sample of style/theme combinations; they cannot prove every possible custom content, embedding context or third-party stylesheet is error-free. A future project must test its own text, translations, data, forms and layout. Firefox/WebKit, physical devices and a full accessibility audit remain separate verification work.
