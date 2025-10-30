<script setup lang="ts">
import { ref, watch } from "vue";
import NavItem from "~/components/ui/NavItem.vue";

interface MenuItem {
	to?: string;
	label: string;
	icon: string;
	order?: number;
	children?: MenuItem[];
	type: "file" | "folder";
}

interface Props {
	items: MenuItem[];
	activePath?: string;
	isCollapsed?: boolean;
	layout?: "horizontal" | "vertical";
	depth?: number;
}

const props = withDefaults(defineProps<Props>(), {
	activePath: "",
	depth: 0,
	isCollapsed: false,
	layout: "vertical",
});

const emit = defineEmits<(e: "navigate", to: string) => void>();

// Keep track of expanded folders
const expandedFolders = ref(new Set<string>());

// Function definitions
const getItemPath = (item: MenuItem): string => {
	// Use the 'to' property for files, or label for folders as a unique identifier
	return item.to || item.label;
};

const isFolderExpanded = (item: MenuItem): boolean => {
	if (item.type === "folder") {
		return expandedFolders.value.has(getItemPath(item));
	}
	return false;
};

const expandFoldersForActivePath = (items: MenuItem[], path: string): void => {
	if (!Array.isArray(items)) return;
	items.forEach((item) => {
		if (item.type === "folder" && item.children) {
			const hasActiveChild = item.children.some(
				(child) =>
					child.to === path ||
					(child.type === "folder" &&
						child.children &&
						child.children.some((grandchild) => grandchild.to === path)),
			);

			if (hasActiveChild) {
				expandedFolders.value.add(getItemPath(item));
				expandFoldersForActivePath(item.children, path);
			}
		}
	});
};

const toggleFolder = (item: MenuItem): void => {
	if (item.type === "folder") {
		const path = getItemPath(item);
		if (expandedFolders.value.has(path)) {
			expandedFolders.value.delete(path);
		} else {
			expandedFolders.value.add(path);
		}
	}
};

const isItemActive = (item: MenuItem): boolean => {
	if (item.to && props.activePath) {
		return props.activePath === item.to;
	}
	return false;
};

const onItemClick = (item: MenuItem): void => {
	if (item.type === "folder") {
		toggleFolder(item);
	} else if (item.to) {
		emit("navigate", item.to);
	}
};

// Initialize folders for active path immediately
if (props.activePath) {
	expandFoldersForActivePath(props.items, props.activePath);
}

// Watch for changes to active path
watch(
	() => props.activePath,
	(newPath) => {
		if (newPath) {
			expandFoldersForActivePath(props.items, newPath);
		}
	},
);
</script>

<template>
  <div :class="layout === 'horizontal' ? 'flex border-b' : 'flex flex-col gap-1'">
    <template v-for="item in items" :key="getItemPath(item)">
      <div>
        <NavItem
          :type="item.type === 'folder' ? 'button' : 'link'"
          :to="item.to"
          :active="isItemActive(item)"
          :collapsed="isCollapsed"
          :layout="layout"
          :icon="item.icon"
          :label="item.label"
          :is-folder="item.type === 'folder'"
          :is-expanded="isFolderExpanded(item)"
          @click="onItemClick(item)"
          class="w-full"
        />
        <div 
          v-if="item.type === 'folder' && item.children && item.children.length > 0" 
          v-show="isFolderExpanded(item)"
          :class="[
            'ml-4 mt-1 border-l-2 border-gray-200 pl-2 transition-all duration-300 ease-in-out',
            depth > 0 ? 'ml-6' : 'ml-4'
          ]"
        >
          <HierarchicalMenu
            :items="item.children"
            :active-path="activePath"
            :is-collapsed="isCollapsed"
            :layout="layout"
            :depth="depth + 1"
            @navigate="$emit('navigate', $event)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.folder-children {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}
</style>