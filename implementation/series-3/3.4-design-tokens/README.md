# Series 3.4 — Design Tokens

## Objective

Create a shared design token package.

This package must become the single source of truth for all visual styles.

No React components should be created.

No Tailwind configuration should be modified.

No CSS variables should be generated yet.

---

## Expected Output

packages/

    design-tokens/

        package.json

        tsconfig.json

        biome.json

        README.md

        src/

            primitive/

            semantic/

            component/

            themes/

            index.ts