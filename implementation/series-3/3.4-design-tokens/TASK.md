# Task 1

Create

packages/design-tokens

---

# Task 2

Create package.json

Requirements

- package name = @repo/design-tokens

- ESM

- exports configured

---

# Task 3

Create tsconfig.json

extends

@repo/tsconfig/library.json

---

# Task 4

Create biome.json

extends

@repo/biome-config

---

# Task 5

Create folder structure

src/

primitive/

semantic/

component/

themes/

---

# Task 6

Create index.ts

Export every public module.

Do not export internal files directly.

---

# Task 7

Create primitive token files

colors.ts

spacing.ts

radius.ts

shadow.ts

typography.ts

motion.ts

z-index.ts

opacity.ts

---

# Task 8

Each file must export immutable objects.

Use

Object.freeze()

or

as const

---

# Task 9

Do NOT create semantic tokens.

Keep files empty except placeholder exports.

---

# Task 10

Verify

Workspace

TypeScript

Biome

All pass