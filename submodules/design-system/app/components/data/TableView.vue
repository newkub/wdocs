<script setup lang="ts">
import { computed, ref } from "vue";
import Table from "~/components/ui/Table.vue";
import { useTask } from "~/composables/useTask";
import type { Task } from "~/types/task";

const { getTasks } = useTask();

const selectedRows = ref<Task[]>([]);

// Prepare headers for the Table component
const tableHeaders = [
	"ID",
	"Task Name",
	"Assignee",
	"Due Date",
	"Priority",
	"Status",
];

// Prepare rows for the Table component
const tableRows = computed(() => {
	const currentTasks = getTasks.value || [];
	return currentTasks.map((task) => [
		`#${task.id}`,
		task.name,
		task.assignee,
		new Date(task.dueDate).toLocaleDateString("en-US", {
			day: "numeric",
			month: "short",
			year: "numeric",
		}),
		task.priority,
		task.status,
	]);
});

function getPriorityColor(priority: string) {
	const colors: Record<string, string> = {
		High: "text-red-600",
		Low: "text-green-600",
		Medium: "text-yellow-600",
	};
	return colors[priority] || "";
}

function getStatusColor(status: string) {
	const colors: Record<string, string> = {
		Done: "bg-green-100 text-green-800",
		"In Progress": "bg-blue-100 text-blue-800",
		Todo: "bg-gray-100 text-gray-800",
	};
	return colors[status] || "";
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          Tasks Table
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Manage and track your tasks in a table format
        </p>
      </div>
      <UButton icon="i-mdi-plus" size="lg">
        Add Task
      </UButton>
    </div>

    <UCard>
      <Table
        :headers="tableHeaders"
        :rows="tableRows"
      />
    </UCard>

    <div v-if="selectedRows.length > 0" class="mt-4 rounded-lg bg-blue-50 p-4">
      <p class="text-sm font-medium text-blue-900">
        {{ selectedRows.length }} task(s) selected
      </p>
    </div>
  </div>
</template>