<script setup lang="ts">
import { computed, ref } from "vue";
import Tabs from "./Tabs.vue";
import VideoPlayer from "./VideoPlayer.vue";
import VideoPlaylistItem from "./VideoPlaylistItem.vue";

interface PlaylistItem {
	id: string;
	title: string;
	artist: string;
	duration: string;
	thumbnail: string;
	src: string;
}

const playlist = ref<PlaylistItem[]>([
	{
		artist: "BOXX MUSIC",
		duration: "4:15",
		id: "1",
		src: "https://www.youtube.com/watch?v=example1",
		thumbnail: "https://i.ytimg.com/vi/example1/hqdefault.jpg",
		title: "คนคนนึง - THE WHITE HAIR CUT",
	},
	{
		artist: "Spicydisc",
		duration: "4:38",
		id: "2",
		src: "https://www.youtube.com/watch?v=example2",
		thumbnail: "https://i.ytimg.com/vi/example2/hqdefault.jpg",
		title: "Better Weather - ฟัง (can't do that)",
	},
	{
		artist: "LOVEiS",
		duration: "3:59",
		id: "3",
		src: "https://www.youtube.com/watch?v=example3",
		thumbnail: "https://i.ytimg.com/vi/example3/hqdefault.jpg",
		title: "SEASON FIVE - อยากอินเพลงรัก",
	},
]);

const activeVideoId = ref(playlist.value[0]?.id);

const activeVideo = computed(() => {
	return playlist.value.find((video) => video.id === activeVideoId.value);
});

const tabItems = computed(() =>
	playlist.value.map((video) => ({
		...video,
		label: video.title,
		value: video.id,
	})),
);

function handleTabChange(videoId: string) {
	activeVideoId.value = videoId;
}
</script>

<template>
  <div class="flex gap-4">
    <div class="w-2/3">
      <VideoPlayer v-if="activeVideo" :src="activeVideo.src" />
    </div>
    <div class="w-1/3">
      <Tabs
        :tabs="tabItems"
        orientation="vertical"
        :model-value="activeVideoId"
        @update:model-value="handleTabChange"
      >
        <template #list-header>
          <div class="p-4">
            <h2 class="text-lg font-bold">Mix - เพลงเพราะๆ ฟังสบายๆ</h2>
            <p class="text-sm text-muted-foreground">Mixes are playlists YouTube makes for you</p>
          </div>
        </template>
        <template #item="{ item }">
          <VideoPlaylistItem :item="item as PlaylistItem" :is-active="(item as PlaylistItem).id === activeVideoId" />
        </template>
      </Tabs>
    </div>
  </div>
</template>
