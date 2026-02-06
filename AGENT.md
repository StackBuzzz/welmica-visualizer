# AGENT.md - AI Agent Development Guide

This document provides comprehensive guidance for AI agents working with this PayloadCMS + Next.js + PostgreSQL starter template.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Collections](#collections)
4. [Blocks](#blocks)
5. [Reusable Fields](#reusable-fields)
6. [Pages & Routing](#pages--routing)
7. [Slot Mechanism](#slot-mechanism)
8. [RichText Editor](#richtext-editor)
9. [Frontend Components](#frontend-components)
10. [Access Control](#access-control)
11. [Best Practices](#best-practices)

---

## Project Overview

**Tech Stack:**

- **CMS:** PayloadCMS 3.x with Lexical Editor
- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL with Drizzle ORM
- **Styling:** Vanilla CSS (no Tailwind)
- **Media Storage:** Local filesystem or Cloudflare R2 (production)

**Key Configuration Files:**

- `src/payload.config.ts` - Main Payload configuration
- `src/configs/index.ts` - Global app configurations
- `src/payload/configs/index.ts` - Collection groups and static directories

---

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/         # Public routes
│   │   ├── [[...slugs]]/   # Static pages catch-all
│   │   └── products/       # Product routes
│   └── (payload)/          # Admin routes
├── configs/                # Global configurations
├── frontend/               # Frontend components
│   ├── components/         # React components
│   │   ├── RenderBlocks/   # Block rendering
│   │   └── RichText/       # RichText rendering
│   ├── hooks/              # React hooks
│   ├── styles/             # CSS files
│   └── utils/              # Frontend utilities
├── lib/                    # Server-side data fetching
├── payload/                # Payload CMS
│   ├── access/             # Access control functions
│   ├── blocks/             # Global block definitions
│   ├── collections/        # Collection configs
│   ├── components/         # Admin UI components
│   ├── editor/             # Lexical editor config
│   ├── fields/             # Reusable field configs
│   └── plugins/            # Payload plugins
└── utils/                  # Shared utilities
```

---

## Collections

### Collection Structure Pattern

Collections are defined in `src/payload/collections/[CollectionName]/index.ts`.

```typescript
import { authenticated } from '@/payload/access/authenticated';
import { collectionGroup } from '@/payload/configs';
import { slugField } from '@/payload/fields/slug';
import type { CollectionConfig } from 'payload';

export const MyCollection: CollectionConfig = {
  slug: 'my_collection',
  admin: {
    useAsTitle: 'label',
    group: collectionGroup.list // Groups: layout, list, media, admin
  },
  access: {
    read: anyone,
    update: authenticated,
    create: authenticated,
    delete: authenticated
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Specifications',
          name: 'specifications',
          fields: [
            /* main fields */
          ]
        },
        {
          label: 'Media',
          name: 'media',
          fields: [
            /* media fields */
          ]
        },
        SeoTab // Optional SEO tab
      ]
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' }
    },
    ...slugField('label') // Auto-synced slug field
  ]
};
```

### Core Collections

The template includes 4 core collections that should not be removed:

| Collection      | Slug               | Purpose                          |
| --------------- | ------------------ | -------------------------------- |
| Users           | `users`            | Admin users                      |
| Pages           | `pages`            | Static and dynamic pages         |
| ResponsiveMedia | `responsive_media` | Images with auto-generated sizes |
| StaticMedia     | `static_media`     | Non-optimized files (PDFs, SVGs) |

Plus a **Global** (`appConfig`) for site-wide settings like header and footer.

> **Note:** Additional collections (Products, Catalogues, etc.) can be added as per project requirements.

### Media Collections

**ResponsiveMedia** - Use for images that need responsive sizes:

- Auto-generates sizes: 384, 768, 1024, 1640, 2048, 3072, 4096
- Converts to WebP format
- Has focal point and crop support
- Use for hero images, banners, large content images

**StaticMedia** - Use for files that shouldn't be processed:

- PDFs, SVGs, documents
- Small-width images where multiple sizes provide no benefit (e.g., thumbnails, icons)
- No image processing applied

---

## Blocks

### Block Registration

Blocks are registered globally in `src/payload.config.ts`:

```typescript
import blocks from '@/payload/blocks';
// ...
export default buildConfig({
  blocks
  // ...
});
```

### Block Definition Pattern

Blocks are defined in `src/payload/blocks/[BlockName].ts`:

```typescript
import { adminGroups } from './configs';
import type { Block } from 'payload';

export const Example: Block = {
  slug: 'example', // do not add Block suffix
  interfaceName: 'ExampleBlock', // TypeScript interface name, with Block suffix
  admin: {
    group: adminGroups.section // Groups: section, dynamic, ui
  },
  fields: [
    // Block fields
  ]
};
```

### Block Groups

**Section Group** (`adminGroups.section`):

- Blocks added directly to pages
- MUST render a `<section>` tag in the DOM
- Examples: Section, custom landing page blocks

**UI Group** (`adminGroups.ui`):

- Blocks used inside other blocks (nested)
- Do NOT render `<section>` tag
- Examples: Grid, RichText

**Dynamic Group** (`adminGroups.dynamic`):

- Special blocks for dynamic pages
- Examples: Slot

### Core Blocks

| Block    | Slug       | Group   | Purpose                                                          |
| -------- | ---------- | ------- | ---------------------------------------------------------------- |
| Section  | `section`  | section | Layout wrapper with styling (wide, margins, padding, background) |
| Slot     | `slot`     | dynamic | Dynamic content placeholder for dynamic pages                    |
| Grid     | `grid`     | ui      | Responsive grid layout                                           |
| RichText | `richText` | ui      | Rich text content                                                |

> **Note:** Additional blocks can be added as per project requirements.

### Block References

Use `blockReferences` to reference globally registered blocks:

```typescript
{
  type: 'blocks',
  name: 'blocks',
  blocks: [],  // Empty array for references
  blockReferences: ['richText', 'grid']  // Reference by slug
}
```

---

## Reusable Fields

### slugField

Auto-synced slug with UI lock mechanism:

```typescript
import { slugField } from '@/payload/fields/slug';

// In collection fields
...slugField('label')  // Syncs from 'label' field
```

### linkField

Internal/external link with reference support:

```typescript
import { linkField } from '@/payload/fields/link';

// In collection/block fields
linkField({
  overrides: { name: 'primaryLink' }
});
```

**Link Types:**

- `reference` - Internal link to Pages or ProductCategories
- `custom` - External URL

### richTextField

Rich text with empty content validation:

```typescript
import { richTextField } from '@/payload/fields/richText';

richTextField({
  name: 'description',
  required: true
});
```

### Responsive Field Wrapper

Wrap any field to make it breakpoint-aware:

```typescript
import { Responsive } from '@/payload/fields/Responsive';
import type { NumberField } from 'payload';

Responsive<NumberField>({
  type: 'number',
  name: 'columns',
  required: true
});
// Generates: { initial, sm, md, lg } for each breakpoint
```

### SeoTab

Standard SEO fields tab:

```typescript
import { SeoTab } from '@/payload/fields/SeoTab';

// In tabs array
{
  type: 'tabs',
  tabs: [
    // ... other tabs
    SeoTab
  ]
}
```

---

## Pages & Routing

### Page Types

**Static Pages** (`pageType: 'static'`):

- Uses `slugs` array field for URL path segments
- Pathname auto-generated as `/{slug1}/{slug2}/...`
- Homepage uses empty slugs array (pathname: `/`)

**Dynamic Pages** (`pageType: 'dynamic'`):

- Uses `route` select field from `dynamicPages` config
- Supports URL patterns with parameters (e.g., `/products/[categorySlug]`)
- Enables slot blocks for content injection

### Dynamic Pages Configuration

Defined in `src/payload/collections/Pages/dynamicPages.ts`:

```typescript
// Example slots - modify/extend as per project needs
export type Slot = 'productCategoryList' | 'productDetails';

interface DynamicPage extends OptionObject {
  value: AppRoutes;
  slots: Slot[];
}

// Example routes - modify/extend as per project needs
export const dynamicPages: DynamicPage[] = [
  {
    label: 'Product List by Category',
    value: '/products/[categorySlug]',
    slots: ['productCategoryList']
  },
  {
    label: 'Product Details',
    value: '/products/[categorySlug]/[productSlug]',
    slots: ['productDetails']
  }
];

export const slots: Slot[] = ['productCategoryList', 'productDetails'];
```

> **Note:** The above routes and slots are examples. Modify or extend them based on your project's specific requirements.

### Adding a New Dynamic Page

1. Add route to `dynamicPages` array in `dynamicPages.ts`
2. Add slot type to `Slot` type union
3. Add slot to `slots` array
4. Create corresponding Next.js route in `src/app/(frontend)/`
5. Implement frontend component with `slotMap` prop

---

## Slot Mechanism

Slots allow injecting dynamic content into CMS-managed page layouts.

### How It Works

1. **CMS Side:** Admin selects a slot block and chooses which slot to use
2. **Frontend Side:** Dynamic route passes content via `slotMap` prop to `RenderBlocks`

### Frontend Implementation

```tsx
// In a dynamic route page
import RenderBlocks from '@/frontend/components/RenderBlocks';

const DynamicPage = async ({ params }) => {
  const { slug } = await params;
  const page = await getPageByPathname(`/example/${slug}`);

  // Create slot content
  const slotContent = <MyDynamicComponent slug={slug} />;

  return (
    <main className='main'>
      <RenderBlocks
        blocks={page.blocks}
        slotMap={{
          mySlotName: slotContent
        }}
      />
    </main>
  );
};
```

### Slot Block Filtering

The slot select field automatically filters options based on the page's route:

```typescript
filterOptions: ({ data, options }) => {
  if (data.pageType === 'static') return [];
  const page = dynamicPages.find((page) => page.value === data.pathname);
  if (!page || page.slots?.length === 0) return [];
  return options.filter((option) => page.slots.includes(option.value));
};
```

---

## RichText Editor

### Global Editor Configuration

Located in `src/payload/editor/index.ts`.

### Available Features

**Typography:**

- Headings (H1-H6) with `.rt-Heading` class
- Paragraphs with `.rt-Text` class
- Blockquote with `.rt-Blockquote` class
- Lists (ordered, unordered, checklist)

**Formatting:**

- Bold, Italic, Underline
- Text alignment
- Indentation
- Horizontal rule

**Custom Features:**

| Feature                | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| FontColorFeature       | Text color picker                          |
| ClassnamePickerFeature | Apply CSS classes (fontSize, marginBottom) |
| StatePickerFeature     | Apply animation presets                    |

**Block Components (inserted as separate elements):**

- Eyebrow - Small label text
- PrimaryButton - CTA button

**Inline Components (inserted within text):**

- Icon - Inline icon insertion

### RichText Styling Classes

Located in `src/frontend/styles/richtext.scss`. Modify as per project requirements.

**Font Size Classes** (applied via ClassnamePickerFeature):

| Class           | Usage                                  |
| --------------- | -------------------------------------- |
| `font-size-xs`  | Extra small text                       |
| `font-size-s`   | Small text                             |
| `font-size-m`   | **Main body text** (default paragraph) |
| `font-size-l`   | Large text                             |
| `font-size-xl`  | Extra large text                       |
| `font-size-xxl` | Heading-level text                     |

Font size classes can include (all can have responsive breakpoint values):

- `font-size`
- `line-height`
- `letter-spacing`

```scss
.font-size {
  &-m {
    font-size: 16px;

    @include media('>md') {
      font-size: 18px;
    }
  }
}
```

**Margin Bottom Classes** (applied via ClassnamePickerFeature):

| Class     | Usage               |
| --------- | ------------------- |
| `mb-xs`   | Extra small spacing |
| `mb-s`    | Small spacing       |
| `mb-m`    | Medium spacing      |
| `mb-l`    | Large spacing       |
| `mb-xl`   | Extra large spacing |
| `mb-auto` | Auto margin         |

Customize values in `richtext.scss` based on project design requirements.

### Animation Presets

**NodeAnimation** - Block-level animations:

- Applied via StatePickerFeature with `nodeAnimation` key
- Presets defined in `src/frontend/components/RichText/wrappers/NodeAnimation/presets.ts`

**TextAnimation** - Inline text animations:

- Applied via StatePickerFeature with `textAnimation` key
- Presets defined in `src/frontend/components/RichText/wrappers/TextAnimation/presets.ts`

Customize values based on project requirements.

### Adding a New Editor Block

1. Create block definition in `src/payload/editor/blocks/MyBlock.ts`
2. Register in `src/payload/editor/index.ts` via `BlocksFeature`
3. Create frontend converter in `src/frontend/components/RichText/converters/MyBlock/`
4. Register converter in `src/frontend/components/RichText/converters/index.ts`

---

## Frontend Components

### RenderBlocks

Renders CMS blocks with optional slot injection:

```tsx
import RenderBlocks from '@/frontend/components/RenderBlocks';

<RenderBlocks
  blocks={page.blocks}
  as='div' // Container element (div | section)
  withoutContainer // Render without wrapper
  slotMap={{
    // Dynamic content for slots
    slotName: <Component />
  }}
/>;
```

### Block Map

Map blocks to React components in `src/frontend/components/RenderBlocks/blockMap.ts`:

```typescript
import type { Config } from '@/payload-types';
import type { FunctionComponent } from 'react';

export type DefinedBlocks = Config['blocks'];
export type DefinedBlocksWithoutSlot = Omit<DefinedBlocks, 'slot'>;

export const blockMap: BlockMap = {
  section: Section,
  grid: Grid,
  richText: RichText
};
```

### RichText Component

Renders rich text content with custom converters:

```tsx
import RichText from '@/frontend/components/RichText';

<RichText
  data={richTextData}
  disableContainer // Render without wrapper div
/>;
```

### JSX Converters

Custom converters in `src/frontend/components/RichText/converters/`:

```typescript
export const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
  defaultConverters
}) => ({
  ...defaultConverters,
  text: TextJSXConverter,
  heading: Heading,
  paragraph: Paragraph,
  blocks: {
    eyebrow: Eyebrow,
    primaryButton: PrimaryButtonConverter
  },
  inlineBlocks: {
    icon: IconJSXConverter
  }
});
```

### CmsLink & getLinkProps

Handle CMS link data:

```tsx
import { getLinkProps } from '@/frontend/utils/getLinkProps';
import Link from 'next/link';

const { href, children, target, rel } = getLinkProps(linkData);
<Link href={href} target={target} rel={rel}>
  {children}
</Link>;
```

---

## Access Control

Located in `src/payload/access/`:

| Function                   | Usage                                             |
| -------------------------- | ------------------------------------------------- |
| `authenticated`            | Only logged-in users                              |
| `authenticatedOrPublished` | Logged-in users OR published content (for drafts) |
| `anyone`                   | Public access                                     |

```typescript
import { authenticated } from '@/payload/access/authenticated';
import { authenticatedOrPublished } from '@/payload/access/authenticatedOrPublished';
import { anyone } from '@/payload/access/anyone';

access: {
  read: authenticatedOrPublished,  // For content with drafts
  read: anyone,                    // For public media
  update: authenticated,
  create: authenticated,
  delete: authenticated
}
```

---

---

## Development Guide

### Animations

- Use **CSS animations** wherever possible for better performance.
- For complex or scroll-triggered animations, use `m` from `motion/react` (Framer Motion).

### Utils

Preferred utility libraries:

- `lodash`
- `react-use`

### Import & Type Conventions

- Use the `@/` alias for internal imports with longer relative paths (e.g., `@/frontend/components/RenderBlocks`).
- **Always** add the `type` suffix to type-only imports:
  ```typescript
  import type { Page } from '@/payload-types';
  ```

---

## Best Practices

### TypeScript Conventions

```typescript
// Import types with 'type' keyword
import type { CollectionConfig, Block } from 'payload';
import type { Page } from '@/payload-types';

// Component pattern
import type { FunctionComponent } from 'react';

interface MyComponentProps {
  title: string;
}

const MyComponent: FunctionComponent<MyComponentProps> = ({ title }) => {
  return <div>{title}</div>;
};
```

### Styling Conventions

- **SCSS**: Use SCSS for styling. Always `@use '@/frontend/styles/media.scss' as *;` to access media query mixins.
- **Breakpoints**: Use `include-media` syntax:
  ```scss
  @include media('>=sm') { ... }
  @include media('>md') { ... }
  ```
- **Utility Classes**: Prefer using standard utility classes like `.limit_width` for container alignment.
- **Variables**: Always use CSS variables from `theme-config.css` for colors and spacing.

### Form Handling Pattern

When creating new forms (e.g., Contact Form):

1. Use `@radix-ui/react-form` for accessibility.
2. Validate server-side using `zod`.
3. Submit data to a custom Payload API endpoint or `form_submissions` collection.

### Naming Conventions

| Item            | Convention                 | Example              |
| --------------- | -------------------------- | -------------------- |
| Collection slug | snake_case                 | `product_categories` |
| Block slug      | camelCase                  | `richText`           |
| Interface names | PascalCase                 | `SectionBlock`       |
| Field names     | camelCase                  | `productImages`      |
| CSS classes     | lowercase with underscores | `limit_width`        |

### File Organization

- One collection per directory in `src/payload/collections/`
- Export collection from `index.ts`
- Place hooks in `hooks/` subdirectory
- Place utilities in `utils/` subdirectory

### Adding New Features Checklist

**New Collection:**

1. Create `src/payload/collections/NewCollection/index.ts`
2. Add to `collections` array in `src/payload.config.ts`
3. Run `npm run generate:types` to update types

**New Block:**

1. Create `src/payload/blocks/NewBlock.ts`
2. Add to `src/payload/blocks/index.ts`
3. Create frontend component in `src/frontend/components/RenderBlocks/NewBlock/`
4. Add to `blockMap` in `src/frontend/components/RenderBlocks/blockMap.ts`
5. Run `npm run generate:types`

**New Dynamic Page:**

1. Add to `dynamicPages` array in `src/payload/collections/Pages/dynamicPages.ts`
2. Create Next.js route in `src/app/(frontend)/`
3. Implement with `slotMap` if using slots

**New Editor Feature:**

1. Create in `src/payload/editor/features/`
2. Add to editor config in `src/payload/editor/index.ts`
3. Create frontend converter if needed

---

## Commands

```bash
# Development
npm run dev           # Start dev server
npm run generate:types # Generate Payload types

# Build
npm run build         # Production build
```

> **Note:** Database migrations are handled automatically by PayloadCMS.

---

## Environment Variables

```env
DATABASE_URI=postgresql://...
PAYLOAD_SECRET=your-secret
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Optional: R2 Storage
R2_ENDPOINT=https://...
R2_ACCESS_KEY=...
R2_SECRET_KEY=...
R2_BUCKET=...

# Optional: Email
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
```
