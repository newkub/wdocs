<script setup lang="ts">
interface Props {
	src: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="aspect-video bg-muted w-full">
    <!-- For now, we'll just display the source URL -->
    <!-- In the future, we can replace this with a real video player component -->
    <div class="flex items-center justify-center h-full">
      <p>Video Source: {{ props.src }}</p>
    </div>
  </div>
</template>
