<script setup lang="ts">
interface Props {
	item: {
		id: string;
		title: string;
		artist: string;
		duration: string;
		thumbnail: string;
		src: string;
	};
	isActive: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="flex items-center gap-4 p-2 rounded-lg" :class="{ 'bg-muted': isActive }">
    <div class="relative flex-shrink-0">
      <img :src="props.item.thumbnail" :alt="props.item.title" class="w-24 h-14 rounded-md object-cover">
      <span class="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded">
        {{ props.item.duration }}
      </span>
      <div v-if="isActive" class="absolute inset-0 flex items-center justify-center bg-black/50">
        <i class="i-ph-play-fill text-white text-2xl"></i>
      </div>
    </div>
    <div class="flex-1">
      <p class="font-semibold text-sm truncate">{{ props.item.title }}</p>
      <p class="text-xs text-muted-foreground">{{ props.item.artist }}</p>
    </div>
  </div>
</template>
