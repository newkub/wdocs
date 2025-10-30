<script setup lang="ts">
defineProps<{
	headers: string[];
	rows: string[][];
	highlightIndex?: number;
}>();
</script>

<template>
  <div class="overflow-x-auto my-4 border border-gray-200 rounded-lg">
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-50">
          <th
            v-for="(header, index) in headers"
            :key="index"
            class="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          :class="[
            'transition-colors',
            highlightIndex === rowIndex
              ? 'bg-blue-100 border-l-4 border-l-blue-500'
              : 'hover:bg-gray-50'
          ]"
        >
          <td
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            :class="[
              'px-4 py-3 text-sm border-b border-gray-100',
              highlightIndex === rowIndex
                ? 'text-gray-900 font-medium'
                : 'text-gray-700'
            ]"
          >
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
