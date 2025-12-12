import type { NavigationItem } from '../../types/docs/navigation';

export const useDocsNavigation = () => {
  return useFetch<NavigationItem[]>('/api/docs/navigation', { key: 'navigation' });
};
