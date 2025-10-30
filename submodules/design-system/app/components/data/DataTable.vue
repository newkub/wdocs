<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, ref } from "vue";

interface Column<T> {
	key: keyof T;
	label: string;
	sortable?: boolean;
	editable?: boolean;
	render?: (value: unknown, row: T) => string;
	width?: string;
}

interface ContextMenuItem {
	label: string;
	icon?: string;
	action: (row: T) => void;
	show?: (row: T) => boolean;
	class?: string;
}

interface DataTableProps<T> {
	columns: Column<T>[];
	data: T[];
	rowKey: keyof T;
	searchable?: boolean;
	searchPlaceholder?: string;
	contextMenuItems?: ContextMenuItem[];
	emptyMessage?: string;
}

const props = withDefaults(defineProps<DataTableProps<T>>(), {
	emptyMessage: "No data available",
	searchable: true,
	searchPlaceholder: "Search...",
});

const emit = defineEmits<{
	edit: [row: T, key: keyof T, value: unknown];
	rowClick: [row: T];
}>();

const searchQuery = ref("");
const sortKey = ref<keyof T | null>(null);
const sortOrder = ref<"asc" | "desc">("asc");
const editingCell = ref<{ rowKey: T[keyof T]; colKey: keyof T } | null>(null);
const editValue = ref("");
const contextMenu = ref<{ show: boolean; x: number; y: number; row: T | null }>(
	{
		row: null,
		show: false,
		x: 0,
		y: 0,
	},
);

const filteredAndSortedData = computed(() => {
	let result = [...props.data];

	// Search
	if (searchQuery.value && props.searchable) {
		const query = searchQuery.value.toLowerCase();
		result = result.filter((row) => {
			return props.columns.some((col) => {
				const value = row[col.key];
				return String(value).toLowerCase().includes(query);
			});
		});
	}

	// Sort
	if (sortKey.value) {
		result.sort((a, b) => {
			const aVal = a[sortKey.value];
			const bVal = b[sortKey.value];
			if (aVal === undefined || bVal === undefined) return 0;
			if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
			if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;
			return 0;
		});
	}

	return result;
});

const toggleSort = (key: keyof T) => {
	if (sortKey.value === key) {
		sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
	} else {
		sortKey.value = key;
		sortOrder.value = "asc";
	}
};

const startEdit = (row: T, col: Column<T>) => {
	if (!col.editable) return;

	editingCell.value = { colKey: col.key, rowKey: row[props.rowKey] };
	editValue.value = String(row[col.key]);
};

const saveEdit = () => {
	if (!editingCell.value) return;

	const row = props.data.find(
		(r) => r[props.rowKey] === editingCell.value?.rowKey,
	);
	if (row) {
		emit("edit", row, editingCell.value.colKey, editValue.value);
	}

	editingCell.value = null;
	editValue.value = "";
};

const cancelEdit = () => {
	editingCell.value = null;
	editValue.value = "";
};

const showContextMenu = (event: MouseEvent, row: T) => {
	event.preventDefault();

	if (!props.contextMenuItems?.length) return;

	contextMenu.value = {
		row,
		show: true,
		x: event.clientX,
		y: event.clientY,
	};
};

const hideContextMenu = () => {
	contextMenu.value.show = false;
};

const executeAction = (action: (row: T) => void) => {
	if (contextMenu.value.row) {
		action(contextMenu.value.row);
	}
	hideContextMenu();
};

const getCellValue = (row: T, col: Column<T>) => {
	const value = row[col.key];
	return col.render ? col.render(value, row) : String(value);
};

const isEditing = (row: T, col: Column<T>) => {
	return (
		editingCell.value?.rowKey === row[props.rowKey] &&
		editingCell.value?.colKey === col.key
	);
};

const visibleContextMenuItems = computed(() => {
	if (!contextMenu.value.row) return [];
	return (
		props.contextMenuItems?.filter(
			(item) => !item.show || (contextMenu.value.row && item.show(contextMenu.value.row)),
		) || []
	);
});

// Close context menu when clicking outside
if (import.meta.client) {
	document.addEventListener("click", hideContextMenu);
}
</script>

<template>
  <div class="w-full">
    <!-- Search Bar -->
    <div v-if="searchable" class="mb-4">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <div class="i-mdi-magnify text-gray-400" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto border border-gray-200 rounded-lg">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-50">
            <th
              v-for="col in columns"
              :key="String(col.key)"
              :style="{ width: col.width }"
              class="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200"
            >
              <button
                v-if="col.sortable"
                class="flex items-center gap-2 hover:text-blue-600 transition-colors"
                @click="toggleSort(col.key)"
              >
                <span>{{ col.label }}</span>
                <div
                  v-if="sortKey === col.key"
                  :class="[
                    sortOrder === 'asc' ? 'i-mdi-arrow-up' : 'i-mdi-arrow-down',
                    'text-blue-600'
                  ]"
                />
                <div v-else class="i-mdi-unfold-more-horizontal text-gray-400" />
              </button>
              <span v-else>{{ col.label }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in filteredAndSortedData"
            :key="String(row[rowKey])"
            class="hover:bg-gray-50 transition-colors cursor-pointer"
            @click="emit('rowClick', row)"
            @contextmenu="showContextMenu($event, row)"
          >
            <td
              v-for="col in columns"
              :key="String(col.key)"
              class="px-4 py-3 text-sm text-gray-700 border-b border-gray-100"
            >
              <template v-if="isEditing(row, col)">
                <input
                  v-model="editValue"
                  type="text"
                  class="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  @keyup.enter="saveEdit"
                  @keyup.esc="cancelEdit"
                  @blur="saveEdit"
                >
              </template>
              <template v-else>
                <span
                  :class="{ 'cursor-pointer hover:bg-gray-100 px-2 py-1 rounded': col.editable }"
                  @dblclick="startEdit(row, col)"
                >
                  {{ getCellValue(row, col) }}
                </span>
              </template>
            </td>
          </tr>
          <tr v-if="filteredAndSortedData.length === 0">
            <td
              :colspan="columns.length"
              class="px-4 py-8 text-center text-gray-500"
            >
              <div class="i-mdi-database-off text-4xl mb-2 mx-auto" />
              <p>{{ emptyMessage }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Context Menu -->
    <Teleport v-if="contextMenu.show" to="body">
      <div
        class="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]"
        :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
      >
        <button
          v-for="(item, index) in visibleContextMenuItems"
          :key="index"
          :class="[
            'w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors',
            item.class || 'text-gray-700 hover:bg-gray-100'
          ]"
          @click="executeAction(item.action)"
        >
          <div v-if="item.icon" :class="item.icon" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>
