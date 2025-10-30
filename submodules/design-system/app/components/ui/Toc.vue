<script setup lang="ts">
import type { TocItem } from "~/shared/types/ui";

const props = withDefaults(
	defineProps<{
		items: TocItem[];
		title?: string;
	}>(),
	{
		title: "On this page",
	},
);

const emit = defineEmits(["item-click"]);

const activeId = ref<string | null>(null);

onMounted(() => {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					activeId.value = entry.target.id;
				}
			});
		},
		{ rootMargin: "0px 0px -80% 0px" },
	);

	props.items.forEach((item) => {
		const el = document.getElementById(item.id);
		if (el) observer.observe(el);
	});

	onBeforeUnmount(() => {
		observer.disconnect();
	});
});
</script>

<template>
  <div>
    <h3 v-if="title" class="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
      <span class="i-mdi-format-list-bulleted"></span>
      <span>{{ title }}</span>
    </h3>
    <div v-if="items.length > 0" class="relative">
      <!-- The main vertical line -->
      <div class="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <ul class="space-y-2">
        <li v-for="(item, index) in items" :key="item.id" class="relative">
          <!-- The horizontal notch line -->
          <div 
            class="absolute left-2.5 top-1/2 w-4 h-0.5 bg-gray-200 transition-colors duration-200"
            :class="{ 'bg-yellow-400': activeId === item.id }"
          ></div>
          
          <a 
            :href="`#${item.id}`"
            class="flex items-center text-sm transition-colors duration-200 ease-in-out"
            :class="[
              activeId === item.id 
                ? 'text-yellow-400 font-bold'
                : 'text-gray-500 hover:text-gray-900',
              `pl-${8 + (item.level - 2) * 4}`
            ]"
            @click.prevent="() => emit('item-click', item.id)"
          >
            <span class="truncate">{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </div>
    <p v-else class="text-sm text-gray-500 text-center py-6 italic">
      No headings on this page.
    </p>
  </div>
</template>