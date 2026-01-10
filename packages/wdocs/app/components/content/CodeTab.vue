<script setup lang="ts">
import { inject } from "vue";

const props = defineProps<{ label: string }>();

const tabs = inject<Ref<string[]>>("tabs");
const _activeTab = inject<Ref<string | null>>("activeTab");

if (tabs) {
	tabs.value.push(props.label);
}
</script>

<template>
	<div v-if="_activeTab === label">
		<slot />
	</div>
</template>
