# corestack-ui

A minimal, production-ready React + TypeScript component library. Built with **Tailwind CSS**, **tsup**, and modern tooling for seamless integration into your projects.

## Features

- ✅ **React 17+ Compatible** — Supports React 17, 18, and 19
- ✅ **TypeScript First** — Fully typed components with JSDoc support
- ✅ **Tailwind CSS Ready** — All components styled with Tailwind utilities
- ✅ **Tree-Shakeable** — Optimized for bundle size with ESM and CommonJS exports
- ✅ **CSS Module Support** — Optional scoped styles for component-specific styling
- ✅ **Zero Dependencies** — Only peers React and Tailwind CSS
- ✅ **Headless & Composable** — Flexible component APIs, accept custom classNames

## Installation

### Via npm

```bash
npm install corestack-ui
```

### Via yarn

```bash
yarn add corestack-ui
```

### Via pnpm

```bash
pnpm add corestack-ui
```

### Peer Dependencies

Make sure you have the following installed:

```bash
npm install react react-dom tailwindcss
```

## Quick Start

### 1. Configure Tailwind CSS

Ensure your Tailwind config scans the library's built files:

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/corestack-ui/**/*.{js,mjs}",
  ],
};

export default config;
```

### 2. Import Styles (Optional)

If you're using component-specific CSS:

```typescript
import "corestack-ui/styles.css";
```

### 3. Use Components

```tsx
import { Button } from "corestack-ui";

export default function App() {
  return (
    <Button 
      variant="primary" 
      size="md"
      onClick={() => alert("Clicked!")}
    >
      Click Me
    </Button>
  );
}
```

## Components

### Button

The `Button` component is a flexible, accessible button with optional ripple effect and loading state.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "ghost"` | `"primary"` | Button variant style |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| `isLoading` | `boolean` | `false` | Show loading spinner |
| `disableRipple` | `boolean` | `false` | Disable ripple effect on click |
| `className` | `string` | `undefined` | Additional Tailwind classes to merge |
| ...rest | `HTMLButtonElement` props | — | Standard HTML button attributes |

#### Example

```tsx
import { Button } from "corestack-ui";
import { useState } from "react";

export default function Demo() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    // Perform action
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Button variant="primary" size="lg">
        Primary Large
      </Button>

      <Button 
        variant="secondary" 
        size="md"
        isLoading={loading}
        onClick={handleClick}
      >
        Submit
      </Button>

      <Button 
        variant="ghost" 
        className="text-blue-600 hover:bg-blue-50"
      >
        Custom Styling
      </Button>

      <Button disabled>
        Disabled
      </Button>
    </div>
  );
}
```

## Build Instructions

### Develop with Watch Mode

```bash
npm run dev
```

This will rebuild the library whenever you modify source files.

### Production Build

```bash
npm run build
```

This command:
1. Compiles TypeScript to JavaScript
2. Generates type definitions (`.d.ts`)
3. Creates both ESM and CommonJS outputs
4. Copies CSS files to `dist/`

### Clean Build

```bash
npm run clean && npm run build
```

## Project Structure

```
corestack-ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── cn.ts              # className merger utility
│   │   └── index.ts
│   ├── styles/
│   │   ├── styles.css         # Global component styles
│   │   └── index.ts
│   ├── types/
│   ├── providers/
│   └── index.ts               # Main entry point
├── dist/                       # Built output (ESM + CJS)
├── tsup.config.ts             # Build configuration
├── tailwind.config.ts         # Tailwind config (for dev)
├── tsconfig.json
└── package.json
```

## Usage with Custom Tailwind Styling

All components accept a `className` prop to merge custom Tailwind utilities:

```tsx
import { Button } from "corestack-ui";

export function CustomButton() {
  return (
    <Button 
      className="bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
    >
      Gradient Button
    </Button>
  );
}
```

The `cn()` utility merges classes intelligently, preventing conflicts and allowing overrides.

## Exports

### Named Exports

```tsx
// Components
import { Button, Autocomplete } from "corestack-ui";

// Utilities
import { cn } from "corestack-ui";

// Types
import type { ButtonProps } from "corestack-ui";

// Styles
import "corestack-ui/styles.css";
```

## TypeScript Support

All components ship with full TypeScript support. Type definitions are included in the package:

```tsx
import type { ButtonProps } from "corestack-ui";

const buttonProps: ButtonProps = {
  variant: "primary",
  size: "lg",
  isLoading: false,
};
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Tree-shakeable**: Only import what you use
- **No runtime CSS-in-JS**: Styles are static Tailwind classes
- **Minimal bundle size**: ~10 KB gzipped (excluding React)
- **Zero dependencies**: Only React and Tailwind as peer dependencies

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-component`)
3. Commit your changes (`git commit -m "Add amazing component"`)
4. Push to the branch (`git push origin feature/amazing-component`)
5. Open a Pull Request

## License

MIT © 2024 — [ProNabowy](https://github.com/ProNabowy)

## Author

**ProNabowy**

- GitHub: [@ProNabowy](https://github.com/ProNabowy)
- NPM: [corestack-ui](https://www.npmjs.com/package/corestack-ui)

## Repository

[github.com/ProNabowy/corestack-ui](https://github.com/ProNabowy/corestack-ui)

## Changelog

### v0.1.0 (Initial Release)

- Initial release with Button component
- Tailwind CSS integration
- TypeScript support
- ESM + CommonJS builds
- CSS Module support
