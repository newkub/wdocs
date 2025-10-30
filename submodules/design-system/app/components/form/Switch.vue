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
    role="switch"
    :aria-checked="model"
    :data-state="model ? 'checked' : 'unchecked'"
    :disabled="props.disabled"
    @click="model = !model"
    :class="[
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
      props.class,
    ]"
  >
    <span
      :data-state="model ? 'checked' : 'unchecked'"
      class="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
    />
  </button>
</template>
