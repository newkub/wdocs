<script setup lang="ts">
interface BreadcrumbItem {
	label: string;
	to: string;
}

interface Props {
	slugParts: string[];
	project: string;
}

const props = defineProps<Props>();

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
	const parts = props.slugParts;
	const crumbs: BreadcrumbItem[] = [
		{ label: "Docs", to: "/docs" },
		{ label: props.project.replace(/-/g, " "), to: `/docs/${props.project}` },
	];

	if (parts.length > 1) {
		const docParts = parts.slice(1);
		docParts.forEach((part, index) => {
			const path = `/docs/${parts.slice(0, index + 2).join("/")}`;
			crumbs.push({ label: part.replace(/-/g, " "), to: path });
		});
	}

	return crumbs;
});
</script>

<template>
  <nav class="px-4 py-3 flex items-center gap-2 text-sm border-b border-gray-200 bg-gray-50/50 backdrop-blur-sm">
    <NuxtLink to="/docs" class="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
      <div class="i-mdi-folder-multiple-outline text-lg" />
    </NuxtLink>
    <template v-for="(crumb, index) in breadcrumbs" :key="crumb.to">
      <div class="i-mdi-chevron-right text-lg text-gray-400" />
      <NuxtLink 
        v-if="index < breadcrumbs.length - 1"
        :to="crumb.to" 
        class="text-gray-500 hover:text-gray-900 transition-colors capitalize font-medium px-2.5 py-1.5 rounded-lg hover:bg-gray-200/60"
      >
        {{ crumb.label }}
      </NuxtLink>
      <span v-else class="text-gray-900 font-semibold capitalize px-2.5 py-1.5 bg-gray-200/70 rounded-lg">{{ crumb.label }}</span>
    </template>
  </nav>
</template>
