<script setup lang="ts">
import { useSlots } from "vue";
import {
	type RouteMode,
	type TabConfig,
	useTabState,
} from "~/composables/useTabState";
import MenuItems from "./MenuItems.vue";

type TabOrientation = "horizontal" | "vertical";
type LayoutType = "default" | "navbar" | "sidebar";
type SidebarPosition = "left" | "right";

const props = withDefaults(
	defineProps<{
		modelValue?: string;
		tabs?: TabConfig[];
		orientation?: TabOrientation;
		isCollapsed?: boolean;
		routeMode?: RouteMode;
		queryParam?: string;
		layout?: LayoutType;
		sidebarPosition?: SidebarPosition;
		defaultTab?: string;
		keepAlive?: boolean;
		lazy?: boolean;
	}>(),
	{
		isCollapsed: false,
		keepAlive: true, // Set default to true as per memory
		layout: "default",
		lazy: true, // Set default to true as per memory
		orientation: "horizontal",
		queryParam: "tab",
		routeMode: "none",
		sidebarPosition: "left",
	},
);

const emit = defineEmits(["update:modelValue", "tab-change"]);

// Use composable for tab state management
const { activeTab, activeComponent, changeTab, isTabActive } = useTabState({
	defaultTab: props.defaultTab,
	modelValue: props.modelValue,
	onTabChange: (value) => {
		emit("update:modelValue", value);
		emit("tab-change", value);
	},
	queryParam: props.queryParam,
	routeMode: props.routeMode,
	tabs: props.tabs || [],
});

const slots = useSlots();
const hasDefaultSlot = computed(() => !!slots.default);

// Convert TabConfig to NavMenuItem format for MenuItems component
const menuItemsData = computed(() =>
	(props.tabs || []).map((tab) => ({
		badge: tab.badge,
		disabled: tab.disabled,
		icon: tab.icon,
		label: tab.label,
		to: tab.to,
		value: tab.value,
	})),
);

// Track loaded tabs for lazy loading
const loadedTabs = ref<Set<string>>(new Set([activeTab.value]));

watch(activeTab, (newTab) => {
	if (props.lazy && newTab) {
		loadedTabs.value.add(newTab);
	}
});

const shouldRenderTab = (tabValue: string) => {
	if (!props.lazy) return true;
	return loadedTabs.value.has(tabValue) || tabValue === activeTab.value;
};
</script>

<template>
  <!-- Layout: Navbar -->
  <div v-if="layout === 'navbar'" class="flex flex-col h-screen">
    <header>
      <slot name="header" />
    </header>

    <!-- Horizontal: tabs ด้านบน content ด้านล่าง -->
    <div v-if="orientation === 'horizontal'" class="flex-1 flex flex-col overflow-hidden">
      <div class="border-b border-gray-200">
        <slot name="list-header" />
        <MenuItems
          v-if="menuItemsData.length"
          :items="menuItemsData"
          :layout="orientation"
          :is-collapsed="isCollapsed"
          :active-value="activeTab"
          @item-click="changeTab"
        >
          <template #item="{ item, navItemProps }">
            <slot name="item" :item="item" :nav-item-props="navItemProps" />
          </template>
        </MenuItems>
      </div>
      <main class="flex-1 overflow-y-auto">
        <KeepAlive v-if="keepAlive">
          <component :is="activeComponent" v-if="activeComponent && shouldRenderTab(activeTab)" />
        </KeepAlive>
        <component :is="activeComponent" v-else-if="activeComponent && shouldRenderTab(activeTab)" />
        <slot v-else-if="hasDefaultSlot" />
      </main>
    </div>

    <!-- Vertical: sidebar ด้านซ้าย content ด้านขวา -->
    <div v-else class="flex-1 grid grid-cols-[auto_1fr] overflow-hidden">
      <aside class="border-r border-gray-200">
        <slot name="list-header" />
        <MenuItems
          v-if="menuItemsData.length"
          :items="menuItemsData"
          :layout="orientation"
          :is-collapsed="isCollapsed"
          :active-value="activeTab"
          @item-click="changeTab"
        >
          <template #item="{ item, navItemProps }">
            <slot name="item" :item="item" :nav-item-props="navItemProps" />
          </template>
        </MenuItems>
      </aside>
      <main class="overflow-y-auto">
        <KeepAlive v-if="keepAlive">
          <component :is="activeComponent" v-if="activeComponent && shouldRenderTab(activeTab)" />
        </KeepAlive>
        <component :is="activeComponent" v-else-if="activeComponent && shouldRenderTab(activeTab)" />
        <slot v-else-if="hasDefaultSlot" />
      </main>
    </div>
  </div>

  <!-- Layout: Sidebar -->
  <div v-else-if="layout === 'sidebar'" class="h-screen bg-gray-100">
    <!-- Horizontal: tabs ด้านบน content ด้านล่าง -->
    <div v-if="orientation === 'horizontal'" class="flex flex-col h-full">
      <div class="border-b border-gray-200 p-2">
        <slot name="list-header" />
        <MenuItems
          v-if="menuItemsData.length"
          :items="menuItemsData"
          :layout="orientation"
          :is-collapsed="isCollapsed"
          :active-value="activeTab"
          @item-click="changeTab"
        >
          <template #item="{ item, navItemProps }">
            <slot name="item" :item="item" :nav-item-props="navItemProps" />
          </template>
        </MenuItems>
      </div>
      <div class="flex-1 overflow-y-auto">
        <KeepAlive v-if="keepAlive">
          <component :is="activeComponent" v-if="activeComponent && shouldRenderTab(activeTab)" />
        </KeepAlive>
        <component :is="activeComponent" v-else-if="activeComponent && shouldRenderTab(activeTab)" />
        <slot v-else-if="hasDefaultSlot" />
      </div>
    </div>

    <!-- Vertical: sidebar สามารถอยู่ซ้ายหรือขวาได้ -->
    <div v-else class="flex flex-row h-full">
      <!-- Sidebar ด้านซ้าย -->
      <div v-if="sidebarPosition === 'left'" class="w-1/4 flex-shrink-0 border-r border-gray-200 p-2 overflow-y-auto">
        <slot name="list-header" />
        <MenuItems
          v-if="menuItemsData.length"
          :items="menuItemsData"
          :layout="orientation"
          :is-collapsed="isCollapsed"
          :active-value="activeTab"
          @item-click="changeTab"
        >
          <template #item="{ item, navItemProps }">
            <slot name="item" :item="item" :nav-item-props="navItemProps" />
          </template>
        </MenuItems>
      </div>

      <!-- Content area -->
      <div class="flex-1 overflow-y-auto">
        <KeepAlive v-if="keepAlive">
          <component :is="activeComponent" v-if="activeComponent && shouldRenderTab(activeTab)" />
        </KeepAlive>
        <component :is="activeComponent" v-else-if="activeComponent && shouldRenderTab(activeTab)" />
        <slot v-else-if="hasDefaultSlot" />
      </div>

      <!-- Sidebar ด้านขวา -->
      <div v-if="sidebarPosition === 'right'" class="w-1/4 flex-shrink-0 border-l border-gray-200 p-2 overflow-y-auto">
        <slot name="list-header" />
        <MenuItems
          v-if="menuItemsData.length"
          :items="menuItemsData"
          :layout="orientation"
          :is-collapsed="isCollapsed"
          :active-value="activeTab"
          @item-click="changeTab"
        >
          <template #item="{ item, navItemProps }">
            <slot name="item" :item="item" :nav-item-props="navItemProps" />
          </template>
        </MenuItems>
      </div>
    </div>
  </div>

  <!-- Layout: Default -->
  <div v-else :class="[props.orientation === 'vertical' ? 'flex gap-6' : 'flex flex-col gap-6', 'w-full h-full']">
    <template v-if="menuItemsData.length">
      <div>
        <slot name="list-header" />
        <MenuItems
          :items="menuItemsData"
          :layout="orientation"
          :is-collapsed="isCollapsed"
          :active-value="activeTab"
          @item-click="changeTab"
        >
          <template #item="{ item, navItemProps }">
            <slot name="item" :item="item" :nav-item-props="navItemProps" />
          </template>
        </MenuItems>
      </div>

      <div class="flex-1">
        <KeepAlive v-if="keepAlive">
          <component :is="activeComponent" v-if="activeComponent && shouldRenderTab(activeTab)" />
        </KeepAlive>
        <component :is="activeComponent" v-else-if="activeComponent && shouldRenderTab(activeTab)" />
      </div>
    </template>

    <template v-else-if="hasDefaultSlot">
      <slot />
    </template>
  </div>
</template>
