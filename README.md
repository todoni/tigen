# tigen

A CLI for converting SVG to typed component.

---

## Features

- ⚡ Fetches SVG icons directly from a Figma page
- 🧠 Automatically generates icon path data and type definitions
- 🚫 No need to install globally – supports `npx`, `yarn dlx`
- ⚙️ Outputs fully typed, ready-to-use icon metadata

---

## Usage

You don't need to install `tigen` to use it:

```bash
npx tigen
# or
yarn dlx tigen
pnpx tigen
```

---

## Requirements

You must set the following environment variables:

| Variable          | Description                   |
| ----------------- | ----------------------------- |
| `FIGMA_API_TOKEN` | Your personal Figma API token |
| `FIGMA_FILE_ID`   | The Figma file ID             |
| `FIGMA_PAGE_NAME` | The name of the page (canvas) |

- Set them directly in you shell using `export`
- Or You can place these in a `.env` file:

```.env
FIGMA_API_TOKEN=your_figma_token
FIGMA_FILE_ID=your_file_id
FIGMA_PAGE_NAME=page_name_in_file
```

---

## Output

Running `tigen` will generate the following files in your project root:

### `svgPaths.ts`

Contains the icon metadata extracted from the SVGs:

```ts
export const svgPaths = {
  ico_24_male: {
    width: "24",
    height: "24",
    paths: ["M19.75 4.25V9.75H18.25...", "..."],
  },
  ico_24_female: {
    width: "24",
    height: "24",
    paths: ["M11.25 20.75V18.75H9.25...", "..."],
  },
  // ...
};
```

### `icons.ts`

Contains typed icon name constants and types:

```ts
export const ICON_NAME = {
  ico_24_male: "ico_24_male",
  ico_24_female: "ico_24_female",
  // ...
} as const;

export type IconName = (typeof ICON_NAME)[keyof typeof ICON_NAME];
```

---

## Example Usage

Here's how you might use the generated output to build a typed `<Icon />` component:

```tsx
// Icon.tsx
import { SVGProps } from "react";
import { svgPaths } from "./svgPaths";
import { IconName } from "./icons";

interface Props extends SVGProps<SVGSVGElement> {
  icon: IconName;
}

export function Icon({ icon, className, ...props }: Props) {
  const { width, height, paths } = svgPaths[icon];

  return (
    <svg
      className={className}
      width={width}
      height={height}
      fillRule="evenodd"
      clipRule="evenodd"
      {...props}
    >
      {paths.map((d, index) => (
        <path key={index} d={d} />
      ))}
    </svg>
  );
}
```

---

## 🔧 Comming Soon

Here are some upcoming features planned for future releases of **tigen**:

- **Local SVG import support**
  Allow generating `svgPaths.ts` and `icons.ts` from a local folder of SVG files, without relying on Figma.
- **Custom output paths**
  Support for specifying suctom output locations for generated files via CLI flags.
- **Icon component generator**
  Auto-generate a reusable `<Icon />` React component template.
