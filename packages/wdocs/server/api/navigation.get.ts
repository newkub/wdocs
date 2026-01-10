import { defineEventHandler } from "h3";
import { contentManager } from "../utils/content";

export default defineEventHandler(async () => {
	try {
		const navigation = await contentManager.getNavigation();
		return navigation;
	} catch (error) {
		console.error("Failed to get navigation tree:", error);
		return [];
	}
});
