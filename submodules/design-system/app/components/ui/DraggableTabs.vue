<script setup lang="ts">
import { useDraggable, useDropZone } from "@vueuse/core";
import { ref } from "vue";
import type { MenuItem } from "~/shared/types/ui";
// Import MenuContext and MenuItem
import MenuContext from "~/components/ui/MenuContext.vue";

interface Tab {
	id: string;
	name: string;
	title?: string;
	icon?: string;
	[key: string]: string | number | boolean | undefined;
}

interface Props {
	tabs: Tab[];
	activeTab?: string;
	panelId: string;
}

const props = withDefaults(defineProps<Props>(), {
	activeTab: "",
});

const emit = defineEmits<{
	(e: "update:activeTab", tabId: string): void;
	(e: "tab-drop", tab: Tab, targetPanelId: string, sourcePanelId: string): void;
	(e: "tab-reorder", fromIndex: number, toIndex: number): void;
	(e: "close-tab", tabId: string): void;
	(e: "close-others", tabId: string): void;
	(e: "close-all"): void;
}>();

// UI Constants
const UI_CONSTANTS = {
	// Drag and drop
	DROP_INDICATOR: {
		COLOR: "bg-blue-500",
		WIDTH: "0.125rem", // Thinner drop indicator
	},

	// Tab styles
	TAB_STYLES: {
		ACTIVE: "border-primary text-primary font-medium",
		BASE: "flex items-center px-3 py-2 text-sm cursor-pointer border-b-2 transition-colors relative",
		INACTIVE:
			"border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
	},

	// Z-index values
	Z_INDEX: {
		DROP_INDICATOR: 20,
		DROP_ZONE: 10,
	},
} as const;

// Drag and drop state
const draggingTab = ref<Tab | null>(null);
const sourcePanelId = ref<string>("");
const dragIndex = ref<number | null>(null);
const dropIndex = ref<number | null>(null);

// Context menu state
const contextMenuVisible = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const contextMenuItems = ref<MenuItem[]>([]);
const contextMenuTargetTab = ref<Tab | null>(null);

// Utility functions moved from tabUtils.ts
const getTabDisplayName = (tab: Tab): string => {
	return tab.title || tab.name || tab.id;
};

const getTabIcon = (tab: Tab): string | undefined => {
	return tab.icon;
};

const isTabActive = (tabId: string, activeTabId: string): boolean => {
	return tabId === activeTabId;
};

const createDragEventData = (
	tab: Tab,
	sourcePanelId: string,
	dragIndex: number | null,
) => {
	return {
		dragIndex,
		sourcePanelId,
		tab,
	};
};

// Handle tab drag start
const onTabDragStart = (tab: Tab, index: number, event: DragEvent) => {
	// Close context menu if it's open
	closeContextMenu();

	draggingTab.value = tab;
	sourcePanelId.value = props.panelId;
	dragIndex.value = index;

	// Change cursor to grabbing during drag
	if (event.dataTransfer) {
		event.dataTransfer.effectAllowed = "move";
		// Set drag data for cross-panel drops
		event.dataTransfer.setData(
			"application/json",
			JSON.stringify(
				createDragEventData(tab, sourcePanelId.value, dragIndex.value),
			),
		);
	}
	document.body.style.cursor = "grabbing";

	// Dispatch custom event for layout-level drag handling
	window.dispatchEvent(
		new CustomEvent("tab-drag-start", {
			detail: { panelId: props.panelId, tab },
		}),
	);
};

// Handle tab drag end
const onTabDragEnd = () => {
	draggingTab.value = null;
	sourcePanelId.value = "";
	dragIndex.value = null;
	dropIndex.value = null;
	// Reset cursor
	document.body.style.cursor = "";

	// Dispatch custom event for layout-level drag handling
	window.dispatchEvent(new CustomEvent("tab-drag-end"));
};

// Handle tab click
const onTabClick = (tabId: string) => {
	// Close context menu if it's open
	closeContextMenu();
	emit("update:activeTab", tabId);
};

// Show context menu for a tab
const showContextMenu = (event: MouseEvent, tab: Tab) => {
	event.preventDefault();
	contextMenuTargetTab.value = tab;
	contextMenuX.value = event.clientX;
	contextMenuY.value = event.clientY;

	contextMenuItems.value = [
		{
			action: "close-others",
			icon: "i-mdi-close-circle-outline",
			label: "Close Others",
		},
		{
			action: "close-all",
			icon: "i-mdi-close-box-multiple-outline",
			label: "Close All",
		},
	];

	contextMenuVisible.value = true;
};

// Handle context menu item click
const handleContextMenuItemClick = (item: MenuItem) => {
	contextMenuVisible.value = false;
	if (!contextMenuTargetTab.value || !item.action) return;

	switch (item.action) {
		case "close":
			emit("close-tab", contextMenuTargetTab.value.id);
			break;
		case "close-others":
			emit("close-others", contextMenuTargetTab.value.id);
			break;
		case "close-all":
			emit("close-all");
			break;
	}
};

// Close context menu
const closeContextMenu = () => {
	contextMenuVisible.value = false;
};

// Handle tab drag over to determine drop position
const onTabDragOver = (
	index: number,
	position: "left" | "right",
	event: DragEvent,
) => {
	event.preventDefault();
	if (event.dataTransfer) {
		event.dataTransfer.dropEffect = "move";
	}
	// Update drop index based on position
	dropIndex.value = position === "left" ? index : index + 1;
};

// Handle tab drop
const onTabDrop = (
	index: number,
	position: "left" | "right",
	event: DragEvent,
) => {
	event.preventDefault();
	if (draggingTab.value && sourcePanelId.value) {
		// Calculate actual drop index
		const actualIndex = position === "left" ? index : index + 1;
		// If dragging within the same panel, emit reorder event
		if (sourcePanelId.value === props.panelId && dragIndex.value !== null) {
			emit("tab-reorder", dragIndex.value, actualIndex);
		} else {
			// Moving to a different panel at specific index
			emit("tab-drop", draggingTab.value, props.panelId, sourcePanelId.value);
		}
		draggingTab.value = null;
		sourcePanelId.value = "";
		dragIndex.value = null;
		dropIndex.value = null;
	}
};

// Handle drop at the end of the tab list
const onPanelDragOver = (event: DragEvent) => {
	event.preventDefault();
	if (event.dataTransfer) {
		event.dataTransfer.dropEffect = "move";
	}
	// Set drop index to the end of the list
	dropIndex.value = props.tabs.length;
};

// Handle drop at the end
const onPanelDrop = (event: DragEvent) => {
	event.preventDefault();
	if (draggingTab.value && sourcePanelId.value) {
		const index = props.tabs.length;
		// If dragging within the same panel, emit reorder event
		if (sourcePanelId.value === props.panelId && dragIndex.value !== null) {
			emit("tab-reorder", dragIndex.value, index);
		} else {
			// Moving to a different panel at the end
			emit("tab-drop", draggingTab.value, props.panelId, sourcePanelId.value);
		}
		draggingTab.value = null;
		sourcePanelId.value = "";
		dragIndex.value = null;
		dropIndex.value = null;
	}
};
</script>

<template>
  <div class="flex border-b border-gray-200 relative">
    <div
      v-for="(tab, index) in tabs"
      :key="tab.id"
      :class="[
        UI_CONSTANTS.TAB_STYLES.BASE,
        isTabActive(tab.id, activeTab) 
          ? UI_CONSTANTS.TAB_STYLES.ACTIVE 
          : UI_CONSTANTS.TAB_STYLES.INACTIVE
      ]"
      draggable="true"
      @dragstart="onTabDragStart(tab, index, $event)"
      @dragend="onTabDragEnd"
      @click="onTabClick(tab.id)"
      @contextmenu="showContextMenu($event, tab)"
    >
      <!-- Left drop zone -->
      <div 
        class="absolute top-0 left-0 w-1/2 h-full z-10"
        @dragover="onTabDragOver(index, 'left', $event)"
        @drop="onTabDrop(index, 'left', $event)"
      />
      
      <!-- Right drop zone -->
      <div 
        class="absolute top-0 right-0 w-1/2 h-full z-10"
        @dragover="onTabDragOver(index, 'right', $event)"
        @drop="onTabDrop(index, 'right', $event)"
      />
      
      <!-- Drop indicator line on the left side of tab -->
      <div 
        v-if="dropIndex === index && draggingTab" 
        class="absolute top-0 bottom-0 bg-blue-500 z-20"
        :style="{ left: '0', width: UI_CONSTANTS.DROP_INDICATOR.WIDTH }"
      />
      
      <div v-if="getTabIcon(tab)" :class="getTabIcon(tab) + ' mr-2'" />
      <span class="truncate">{{ getTabDisplayName(tab) }}</span>
    </div>
    <!-- Drop indicator at the end of the tab list -->
    <div 
      v-if="dropIndex === tabs.length && draggingTab && tabs.length > 0" 
      class="absolute top-0 bottom-0 bg-blue-500 z-20"
      :style="{ left: '100%', transform: 'translateX(-50%)', width: UI_CONSTANTS.DROP_INDICATOR.WIDTH }"
    />
    <!-- Panel drop zone -->
    <div 
      class="absolute top-0 left-0 w-full h-full z-0"
      @dragover="onPanelDragOver"
      @drop="onPanelDrop"
    />
    
    <!-- Context Menu -->
    <MenuContext
      :show="contextMenuVisible"
      :x="contextMenuX"
      :y="contextMenuY"
      :items="contextMenuItems"
      @item-click="handleContextMenuItemClick"
      @close="closeContextMenu"
    />
  </div>
</template>