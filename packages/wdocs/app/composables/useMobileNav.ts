import { ref } from "vue";

const isMobileNavOpen = ref(false);

export function useMobileNav() {
	const toggle = () => {
		isMobileNavOpen.value = !isMobileNavOpen.value;
	};

	return { isMobileNavOpen, toggle };
}
