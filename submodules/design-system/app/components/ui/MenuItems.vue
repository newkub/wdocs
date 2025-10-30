<script setup lang="ts">
import type { MenuItem } from "~/shared/types/ui";
import MenuContext from "~/components/ui/MenuContext.vue";
import NavItem from "~/components/ui/NavItem.vue";

type NavMenuItem = {
	to?: string; // for links
	value?: string; // for buttons
	label: string;
	icon?: string;
	[key: string]: string | number | boolean | undefined;
};

interface Props {
	items: NavMenuItem[];
	activeValue?: string; // for button active state
	isCollapsed?: boolean;
	layout?: "horizontal" | "vertical";
	variant?: "default" | "underline";
}

const props = withDefaults(defineProps<Props>(), {
	isCollapsed: false,
	layout: "vertical",
	variant: "default",
});

const emit = defineEmits(["item-click", "context-item-click"]);
const route = useRoute();

// --- Context Menu State ---
const showContextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const selectedContextItem = ref<NavMenuItem | null>(null);

// TODO: Replace with dynamic items, perhaps from a prop
const contextMenuItems = computed<MenuItem[]>(() => {
	if (!selectedContextItem.value) return [];
	return [
		{
			action: "action1",
			label: `Action 1 for ${selectedContextItem.value.label}`,
		},
		{ action: "action2", label: "Action 2" },
		{ separator: true },
		{ action: "delete", danger: true, label: "Delete" },
	];
});

function openContextMenu(event: MouseEvent, item: NavMenuItem) {
	selectedContextItem.value = item;
	contextMenuX.value = event.clientX;
	contextMenuY.value = event.clientY;
	showContextMenu.value = true;
}

function closeContextMenu() {
	showContextMenu.value = false;
}

function onContextItemClick(contextItem: MenuItem) {
	// You can emit an event to the parent component with both the original item and the context menu action
	emit("context-item-click", {
		action: contextItem.action,
		item: selectedContextItem.value,
	});
	console.log(
		`Context action '${contextItem.action}' on item`,
		selectedContextItem.value,
	);
}

const isItemActive = (item: NavMenuItem) => {
	if (item.to) {
		// Link logic
		if (item.to === "/") return route.path === "/";
		return route.path.startsWith(item.to);
	}
	if (item.value) {
		// Button logic
		return props.activeValue === item.value;
	}
	return false;
};

function onItemClick(item: NavMenuItem) {
	if (item.value) {
		emit("item-click", item.value);
	}
}
</script>

<template>
  <div :class="layout === 'horizontal' ? 'flex' : 'flex flex-col gap-0.5'" @contextmenu.prevent>
    <NavItem
      v-for="item in items"
      :key="item.to || item.value"
      :type="item.to ? 'link' : 'button'"
      :to="item.to"
      :active="isItemActive(item)"
      :collapsed="isCollapsed"
      :layout="layout"
      :icon="item.icon || ''"
      :label="item.label"
      :padding="variant === 'underline' ? 'px-2 py-3' : 'px-3 py-2'"
      :border-radius="variant === 'underline' ? 'rounded-none' : undefined"
      :active-bg-color="variant === 'underline' ? 'bg-primary/10' : undefined"
      :active-text-color="variant === 'underline' ? 'text-primary' : undefined"
      :hover-bg-color="variant === 'underline' ? 'bg-primary/5' : undefined"
      :hover-text-color="variant === 'underline' ? 'hover:text-primary' : ''"
      :class="{
        'border-b-2': variant === 'underline',
        'border-primary': variant === 'underline' && isItemActive(item),
        'border-transparent': variant === 'underline' && !isItemActive(item),
      }"
      @click="onItemClick(item)"
      @contextmenu.prevent="openContextMenu($event, item)"
    >
      <template #item="{ item: navItemProps }">
        <slot name="item" :item="item" :nav-item-props="navItemProps" />
      </template>
    </NavItem>
  </div>

  <MenuContext
    :show="showContextMenu"
    :x="contextMenuX"
    :y="contextMenuY"
    :items="contextMenuItems"
    @close="closeContextMenu"
    @item-click="onContextItemClick"
  />
</template>