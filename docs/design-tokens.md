# Design tokens

Semantic CSS custom properties are the source of truth. Tailwind v4 exposes supported utility names through @theme inline in styles/globals.css.

## Colors

Every theme has light and dark values for background/foreground, primary/primary-foreground, secondary/secondary-foreground, accent/accent-foreground, card/card-foreground, muted/muted-foreground, border/input/ring, success/warning/destructive/info, link/selected, sidebar/sidebar-foreground/sidebar-accent, and five chart series.

Use paired foreground/background tokens together. Status colors are intended as text or subtle accents, not arbitrary filled buttons without a checked foreground. Gradients reference semantic variables. Theme JSON stores six-digit hex values so validation and WCAG contrast calculations remain deterministic.

ThemeVariables returns CSSProperties and never changes document-global state. ThemeScope propagates variables to portalled dialogs, menus and tooltips.

## Style parameters

Each profile provides heading/body font stacks, weights, heading scale, density multiplier, maximum width, base spacing, border width/style, radius, surface, elevation, decoration, button/input/background treatment, default motion, suitable categories and accessibility notes.

The renderer exposes these as variables and data attributes. Layout-specific rules use the same values. Fonts use local system stacks so builds and previews require no font network access. A consuming app may supply licensed fonts by extending the profile.

## Motion

--motion-duration coordinates simple CSS transitions. Rich transitions use the selected typed Motion profile. Reduced motion disables CSS animations/transitions and nonessential transforms. no-motion also disables transitions even when the OS has no reduction preference.

## Contrast

Unit tests check foreground pairs at 4.5:1 across all 48 theme/mode combinations. This is automated palette coverage, not a claim of a comprehensive accessibility audit. Check actual content, images, focus states and all modified compositions in a browser.
