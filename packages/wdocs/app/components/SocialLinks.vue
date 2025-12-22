<script setup lang="ts">
const { wdocs } = useAppConfig()

const socialIcons: Record<string, string> = {
  github: 'mdi:github',
  twitter: 'mdi:twitter',
  // Add other social platforms here
}

interface Social {
  name: string;
  link: string;
  icon: string;
}

const _socials = computed<Social[]>(() => {
  return Object.entries(wdocs.socials || {})
    .map(([key, link]) => ({
      name: key,
      link: link as string,
      icon: socialIcons[key]
    }))
    .filter((social): social is Social => !!social.icon)
})
</script>

<template>
  <div class="flex items-center gap-2">
    <a v-for="social in _socials" :key="social.name" :href="social.link" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
      <Icon :name="social.icon" class="w-5 h-5" />
    </a>
  </div>
</template>
