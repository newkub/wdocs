<script setup lang="ts">
interface Props {
	id?: string;
	disabled?: boolean;
	class?: string;
}
const props = defineProps<Props>();
const model = defineModel<boolean>();
</script>

<template>
  <button
    :id="props.id"
    type="button"
    role="checkbox"
    :aria-checked="model"
    :data-state="model ? 'checked' : 'unchecked'"
    :disabled="props.disabled"
    @click="model = !model"
    :class="[
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex items-center justify-center',
      props.class,
    ]"
  >
    <span v-if="model" class="i-mdi-check h-4 w-4" />
  </button>
</template>
