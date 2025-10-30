<script setup lang="ts">
import { onClickOutside, useEventListener } from "@vueuse/core";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import type { MenuItem } from "~/shared/types/ui";
import NavItem from "~/components/ui/NavItem.vue";
import Scroll from "~/components/ui/Scroll.vue";
import Search from "~/components/ui/Search.vue";
import { isComponentHandlingContextMenu } from "~/composables/useContextMenu";
import {
	useMenuCoordination,
	useMenuFilter,
	useMenuKeyboard,
	useMenuPosition,
	useSubmenu,
} from "~/composables/useMenu";

interface Props {
	show?: boolean;
	x?: number;
	y?: number;
	items: MenuItem[];
	searchable?: boolean;
	positioning?: "auto" | "above-cursor" | "right-of" | "left-of";
	align?: "left" | "right";
}

const props = withDefaults(defineProps<Props>(), {
	align: "left",
	positioning: "auto",
	searchable: false,
	show: undefined, // Changed from false to undefined
	x: 0,
	y: 0,
});

const emit = defineEmits(["item-click", "close", "update:show"]);

// Internal state for when not controlled by parent
const internalShow = ref(false);
const internalX = ref(0);
const internalY = ref(0);

// Computed properties to use either props or internal state
const isVisible = computed(() =>
	props.show !== undefined ? props.show : internalShow.value,
);
const menuX = computed(() =>
	props.x !== undefined ? props.x : internalX.value,
);
const menuY = computed(() =>
	props.y !== undefined ? props.y : internalY.value,
);

const menuRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const activeIndex = ref(-1);
const searchQuery = ref("");
const hoveredItem = ref<MenuItem | null>(null);
const showSubmenu = ref(false);
const submenuPosition = ref({ left: 0, top: 0 });

// Use composables
const { menuPosition, updatePosition } = useMenuPosition({
	isVisible,
	menuRef,
	menuX,
	menuY,
	positioning: props.positioning,
});

const { filteredItems, selectableItems } = useMenuFilter({
	items: computed(() => props.items),
	searchQuery,
});

const { handleItemHover, handleSubmenuItemClick } = useSubmenu({
	hoveredItem,
	showSubmenu,
	submenuPosition,
});

// Method to open the context menu (for internal use)
const open = (x: number, y: number) => {
	// Notify other context menus to close
	closeOtherMenus();

	internalX.value = x;
	internalY.value = y;
	internalShow.value = true;
};

// Method to close the context menu
const close = () => {
	if (props.show !== undefined) {
		// Controlled mode - emit close event
		emit("update:show", false);
		emit("close");
	} else {
		// Uncontrolled mode - update internal state
		internalShow.value = false;
	}

	searchQuery.value = "";
	activeIndex.value = -1;
	showSubmenu.value = false;
	hoveredItem.value = null;
};

// Use menu coordination composable
const { closeOtherMenus, unsubscribe } = useMenuCoordination({
	close,
	isVisible,
});

// Set the global flag when the component is mounted and visible
onMounted(() => {
	if (isVisible.value) {
		isComponentHandlingContextMenu.value = true;
	}
});

// Reset the global flag and unsubscribe when the component is unmounted
onUnmounted(() => {
	isComponentHandlingContextMenu.value = false;
	unsubscribe();
});

// --- Focus & Click Outside ---
onClickOutside(menuRef, () => close());

// --- Global Context Menu Prevention ---
useEventListener(document, "contextmenu", (e) => {
	// If this menu is visible, prevent default to avoid browser context menu
	if (isVisible.value) {
		e.preventDefault();
	}
});

// --- Keyboard Navigation ---
const { setupKeyboardNavigation } = useMenuKeyboard({
	activeIndex,
	close,
	handleItemClick,
	isVisible,
	selectableItems,
});

setupKeyboardNavigation();

function handleItemClick(item: MenuItem) {
	if (item.submenu && item.submenu.length > 0) {
		// Don't close, just show submenu
		return;
	}
	if (item.action) {
		emit("item-click", item);
		close();
	}
}

// --- Lifecycle & Watchers ---
watch(
	() => isVisible.value,
	(isShown) => {
		if (isShown) {
			// Set active index to first item
			activeIndex.value = selectableItems.value.length > 0 ? 0 : -1;

			nextTick(() => {
				updatePosition();

				if (props.searchable) {
					// Focus search input if searchable
					const searchInput = menuRef.value?.querySelector("input");
					if (searchInput instanceof HTMLInputElement) {
						searchInput.focus();
					}
				} else {
					menuRef.value?.focus();
				}
			});
		} else {
			searchQuery.value = "";
			activeIndex.value = -1;
			showSubmenu.value = false;
			hoveredItem.value = null;
		}
	},
);

watch(
	() => [menuX.value, menuY.value],
	() => {
		if (isVisible.value) {
			updatePosition();
		}
	},
);

watch(filteredItems, () => {
	if (isVisible.value) {
		// Reset to first item when filtered items change
		activeIndex.value = selectableItems.value.length > 0 ? 0 : -1;
		nextTick(() => updatePosition());
	}
});

watch(searchQuery, (newVal, oldVal) => {
	// Reset to first item on search
	activeIndex.value = selectableItems.value.length > 0 ? 0 : -1;

	// If search query is empty and user pressed backspace, close menu
	if (newVal === "" && oldVal === "" && props.searchable) {
		close();
	}
});

// Handle backspace on empty search
function handleSearchKeydown(event: KeyboardEvent) {
	if (event.key === "Backspace" && searchQuery.value === "") {
		close();
	}
}

// Expose methods for parent components to use
defineExpose({
	close,
	open,
});
</script>

<template>
  <div 
    v-if="isVisible"
    ref="menuRef"
    class="fixed z-50 min-w-44 bg-white rounded-lg shadow-md border border-gray-100 py-1.5 focus:outline-none"
    :style="{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }"
    tabindex="-1"
  >
    <Search
      v-if="searchable"
      ref="searchInputRef"
      v-model="searchQuery"
      class="px-2.5 pt-2 pb-1.5"
      @keydown="handleSearchKeydown"
    />

    <Scroll class="max-h-72">
      <template v-for="(item, index) in filteredItems" :key="index">
        <div
          v-if="item.separator"
          class="my-1 border-t border-gray-200 mx-1.5"
        />

        <NavItem
          v-else
          :label="item.label || ''"
          :icon="item.icon"
          :active="activeIndex === selectableItems.indexOf(item)"
          layout="horizontal"
          type="button"
          padding="px-3 py-2"
          border-radius="rounded-md"
          font-size="text-sm"
          :inactive-text-color="item.danger ? 'text-red-400' : 'text-gray-600'"
          :hover-bg-color="item.danger ? 'hover:bg-red-50' : 'hover:bg-gray-100'"
          :active-bg-color="activeIndex === selectableItems.indexOf(item) ? 'bg-blue-400' : ''"
          :active-text-color="activeIndex === selectableItems.indexOf(item) ? 'text-white' : ''"
          @click="handleItemClick(item)"
          @mouseenter="handleItemHover(item, $event)"
        />
      </template>
    </Scroll>

    <div
      v-if="showSubmenu && hoveredItem?.submenu"
      class="fixed z-50 min-w-44 bg-white rounded-lg shadow-md border border-gray-100 py-1.5"
      :style="{ top: `${submenuPosition.top}px`, left: `${submenuPosition.left}px` }"
    >
      <template v-for="(subItem, subIndex) in hoveredItem.submenu" :key="subIndex">
        <div
          v-if="subItem.separator"
          class="my-1 border-t border-gray-200 mx-1.5"
        />

        <NavItem
          v-else
          :label="subItem.label || ''"
          :icon="subItem.icon"
          layout="horizontal"
          type="button"
          padding="px-3 py-2"
          border-radius="rounded-md"
          font-size="text-sm"
          :inactive-text-color="subItem.danger ? 'text-red-400' : 'text-gray-600'"
          :hover-bg-color="subItem.danger ? 'hover:bg-red-50' : 'hover:bg-gray-100'"
          @click="handleSubmenuItemClick(subItem, emit, close)"
        />
      </template>
    </div>

    <slot name="bottom" />
  </div>
</template>