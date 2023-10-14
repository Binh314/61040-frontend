<script setup lang="ts">
import createEventForm from "@/components/Event/CreateEventForm.vue";
import EditEventForm from "@/components/Event/EditEventForm.vue";
import EventComponent from "@/components/Event/EventComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SearchEventForm from "./SearchEventForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let events = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getEventFeed(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/feed/events", "GET")
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  events.value = postResults;
}

async function getEvents(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/events", "GET", { query })
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  events.value = postResults;
}

function updateEditing(id: string) {
  editing.value = id;
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
  <section v-if="isLoggedIn">
    <h2>Create a post:</h2>
    <createEventForm @refreshPosts="getEventFeed" />
  </section>
  <div class="row">
    <h2 v-if="!searchAuthor">Events:</h2>
    <h2 v-else>Events by {{ searchAuthor }}:</h2>
    <SearchEventForm @getPostsByAuthor="getEvents" />
  </div>
  <section class="events" v-if="loaded && events.length !== 0">
    <article v-for="event in events" :key="event._id">
      <EventComponent v-if="editing !== event._id" :event="event" @refreshEvents="getEventFeed" @editEvents="updateEditing" />
      <EditEventForm v-else :event="event" @refreshEvents="getEventFeed" @editEvent="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No events found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
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

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
