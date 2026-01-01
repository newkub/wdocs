<script setup lang="ts">
import type { NavItem as NavItemType } from '../../shared/types'

const props = defineProps<{
  item: NavItemType
  activePath: string
  depth?: number
}>()

const isSubmenuOpen = ref(false)
const hasChildren = computed(() => props.item.children && props.item.children.length > 0)

const _toggleSubmenu = () => {
  if (hasChildren.value) {
    isSubmenuOpen.value = !isSubmenuOpen.value
  }
}

const _isActive = computed(() => props.activePath === props.item.link)
const _paddingLeft = computed(() => `${(props.depth || 0) * 0.75}rem`)
</script>

<template>
  <li>
    <div 
      @click="_toggleSubmenu"
      class="flex items-center justify-between rounded-md py-1 transition-colors duration-150 cursor-pointer"
      :style="{ paddingLeft: _paddingLeft }"
      :class="[
        _isActive
          ? 'text-primary-500 font-medium bg-primary-50 dark:bg-primary-900/10'
          : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
      ]"
    >
      <NuxtLink :to="item.link" class="flex items-center gap-2 flex-grow">
        <Icon v-if="item.icon" :name="item.icon" class="w-4 h-4" />
        <span>{{ item.text }}</span>
      </NuxtLink>
      <Icon 
        v-if="hasChildren"
        name="mdi:chevron-right"
        class="w-4 h-4 mr-2 transition-transform duration-200"
        :class="{ 'rotate-90': isSubmenuOpen }"
      />
    </div>
    <ul v-if="hasChildren && isSubmenuOpen" class="mt-1">
      <NavItem
        v-for="child in item.children"
        :key="child.link"
        :item="child"
        :active-path="props.activePath"
        :depth="(props.depth || 0) + 1"
      />
    </ul>
  </li>
</template>