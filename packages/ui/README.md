# @xplored/ui

Reusable UI primitives and navigation components extracted from the XploreD site.

## Structure

- `src/components`: framework-agnostic React components
- `src/icons.ts`: shared icon registry and icon metadata
- `src/index.ts`: public exports

## Reuse Notes

- Components are intentionally decoupled from Next.js routing.
- Host apps can inject their own link component through the `LinkComponent` prop.
- Styling expects the host app to provide the same CSS custom properties used by XploreD tokens.
