import { defineNuxtPlugin, useRuntimeConfig } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig().public.wdocsContent;

	nuxtApp.provide("contentConfig", config);
});
