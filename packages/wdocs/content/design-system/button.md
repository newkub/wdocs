---
title: Button
description: A customizable button component for various actions.
---

# Button

The `Button` component is a versatile element for user interactions.

<design-system-ComponentShowcase>
  <template #preview>
    <div class="flex items-center gap-4 flex-wrap">
      <design-system-DsButton>Primary</design-system-DsButton>
      <design-system-DsButton variant="secondary">Secondary</design-system-DsButton>
      <design-system-DsButton variant="ghost">Ghost</design-system-DsButton>
    </div>
  </template>
  <template #code>
    ```vue
    <template>
      <DsButton>Primary</DsButton>
      <DsButton variant="secondary">Secondary</DsButton>
      <DsButton variant="ghost">Ghost</DsButton>
    </template>
    ```
  </template>
  <template #props>
    | Prop      | Type                              | Default     |
    |-----------|-----------------------------------|-------------|
    | `variant` | `'primary'`, `'secondary'`, `'ghost'` | `'primary'` |
    | `size`    | `'sm'`, `'md'`, `'lg'`              | `'md'`      |
  </template>
</design-system-ComponentShowcase>
