# Adding themes

Follow docs/design-tokens.md and docs/extension-guide.md. Create registry/themes/<id>.json with every semantic light/dark token and gradient preset. Values must be valid six-digit hex colors. Test the required foreground/background pairs at 4.5:1. Regenerate the catalog; the theme explorer discovers it through generated imports. Never duplicate component trees to change colors.
