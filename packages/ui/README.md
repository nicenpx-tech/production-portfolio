# @repo/ui

Shared UI Component Library.
This package contains reusable presentation components only.

# Production UI Component Library

A production-ready, accessible, and tree-shakeable UI component library built with React 19, TypeScript, and Tailwind CSS.

## Features

- **React 19 Ready**: Built for the latest React features
- **Fully Typed**: Comprehensive TypeScript support
- **Accessible**: WCAG AA compliant by default
- **Theme System**: Built-in dark mode support
- **Tree Shakeable**: Optimal bundle sizes
- **React Hook Form**: Native form integration
- **CVA Variants**: Consistent styling with class-variance-authority

## Installation

```bash
bun add @repo/ui
```

## Usage

```tsx
import { Button, TextField, Card } from '@repo/ui';

export function MyComponent() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Welcome</Card.Title>
      </Card.Header>
      <Card.Content>
        <TextField label="Email" placeholder="Enter your email" />
        <Button variant="primary">Submit</Button>
      </Card.Content>
    </Card>
  );
}
```

## Component Categories

### Primitives
- Box, Flex, Grid, Stack
- Text, Heading
- Container, Divider, Spacer, Center, AspectRatio

### Forms
- Button
- TextField, PasswordField, Textarea
- Checkbox, Radio, RadioGroup, Switch
- Select, MultiSelect
- CurrencyInput, DatePicker, OTPInput, FileUpload

### Feedback
- Alert, Toast, Spinner, Skeleton, Progress
- LoadingOverlay, ErrorBoundary

### Overlays
- Dialog, Drawer, Popover, Tooltip
- Dropdown, CommandPalette, ContextMenu

### Navigation
- Sidebar, Navbar, Tabs, Breadcrumb, Pagination, Menu

### Layouts
- PageLayout, DashboardLayout, AuthLayout
- PageHeader, Section, ContentContainer

### Data Display
- Card, Badge, Avatar, Tag, EmptyState, Table, DataTable, Timeline

## Development

```bash
# Install dependencies
bun install

# Run Storybook
bun run storybook

# Run tests
bun run test

# Type check
bun run typecheck
```

## Architecture

### Layered Structure

```
packages/ui/src/
├── primitives/      # Basic building blocks (no business logic)
├── components/      # Reusable compound components
├── forms/          # Form components with RHF integration
├── feedback/       # User feedback components
├── overlays/       # Modal and overlay components
├── navigation/     # Navigation components
├── layouts/        # Layout components
├── data-display/   # Data visualization components
├── hooks/          # Custom React hooks
├── providers/      # Context providers (Theme, etc.)
└── utils/          # Utility functions
```

### Component Standards

Every component follows these standards:

- ✅ `forwardRef` for ref forwarding
- ✅ `className` prop for customization
- ✅ `displayName` for debugging
- ✅ CVA variants for styling
- ✅ Full TypeScript types
- ✅ Accessibility (ARIA attributes)
- ✅ Dark mode support
- ✅ Keyboard navigation
- ✅ Focus management

### Composition Pattern

Prefer compound components over monolithic props:

```tsx
// ✅ Good
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Actions</Card.Footer>
</Card>

// ❌ Avoid
<Card title="Title" footer="Actions">
  Content
</Card>
```

## Accessibility

All components are built with accessibility in mind:

- Semantic HTML elements
- ARIA attributes where needed
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Sufficient color contrast

## Testing

Components are tested with Vitest and React Testing Library:

```bash
# Run all tests
bun run test

# Watch mode
bun run test:watch

# Coverage
bun run test:coverage
```

## Theme System

Built-in dark mode support via ThemeProvider:

```tsx
import { ThemeProvider } from '@repo/ui';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

## License

MIT