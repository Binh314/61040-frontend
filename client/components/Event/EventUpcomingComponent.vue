<script setup lang="ts">
import EventBriefComponent from "@/components/Event/EventBriefComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let events = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let detailed = ref<Array<string>>([]);
let searchHost = ref("");

async function getEventFeed(host?: string) {
  let query: Record<string, string> = host !== undefined ? { host } : {};
  let eventResults;
  try {
    eventResults = await fetchy("/api/feed/events", "GET")
  } catch (_) {
    return;
  }
  searchHost.value = host ? host : "";
  events.value = eventResults;
}

async function getEvents(host?: string) {
  let query: Record<string, string> = {};
  let eventResults;
  try {
    eventResults = await fetchy("/api/events", "GET", { query })
  } catch (_) {
    return;
  }
  events.value = eventResults;
}

onBeforeMount(async () => {
  if (isLoggedIn) {
    await getEventFeed();
  } else {
    await getEvents();
  }
  loaded.value = true;
});
</script>

<template>
  <section class="events" v-if="loaded && events.length !== 0">
  <h2>Events for You</h2>
  <div v-for="event in events" :key="event._id">
      <EventBriefComponent class="brief" :event="event"/>
  </div>
  </section>
</template>

<style scoped>
h2 {
  margin-bottom: 0;
}

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  /* max-width: 60em; */
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.events {
  padding: 1em;
}

.formArea {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 1em
}
</style>
