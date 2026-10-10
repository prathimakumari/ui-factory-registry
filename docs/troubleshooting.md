# Troubleshooting

## Unknown ID

Run registry:list --search <term>. The brief's saas-landing-03 was illustrative; the actual SaaS IDs are saas-landing-01 and saas-landing-02. Never silently replace an unknown selection.

## Missing source or stale catalog

Update the individual manifests, then run registry:generate and registry:validate. Generated files should not be edited manually. Section IDs also need a mapping in lib/section-map.tsx.

## Unsupported override

A hero override cannot be applied to a dashboard that has no hero slot. Choose a matching section family, or extend the template intentionally.

## Windows sandbox errors

The development environment may block Node's user-information API or child process creation. tsx can report uv_os_get_passwd ENOMEM even when memory is available. Run the same authorized command in an ordinary local terminal or approved execution context. Do not remove validation to bypass this environment restriction.

## pnpm install/build approvals

pnpm-workspace.yaml explicitly allows esbuild and unrs-resolver build scripts. Dependencies are pinned in package.json and pnpm-lock.yaml. Use the declared pnpm version. Do not ignore unsupported peer dependency combinations.

## Browser tests

Run pnpm exec playwright install chromium before pnpm test:e2e. Tests start a production server on port 3100; run pnpm build first. If 3100 is in use, stop the process you own or change the test configuration deliberately.

## Export integration

Preserve @/*, install dependencies.json, and import styles/globals.css. The renderer requires React; it is not a static HTML export. Missing photography means public/images was not copied or your application-specific paths have not been supplied.

## Clipboard or storage unavailable

Browser security contexts can restrict clipboard/storage. Export JSON remains available. Select inspector text manually when clipboard access is denied. Preferences are optional and never required to render a template.

## Sample behavior

Preview requests do not reach a backend. Refreshing resets local state. Connect real services in your consuming application and replace fictional data before launch.
