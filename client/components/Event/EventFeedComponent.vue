<script setup lang="ts">
import createEventForm from "@/components/Event/CreateEventForm.vue";
import EditEventForm from "@/components/Event/EditEventForm.vue";
import EventComponent from "@/components/Event/EventComponent.vue";
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
  let query: Record<string, string> = host !== undefined ? { host } : {};
  let eventResults;
  try {
    eventResults = await fetchy("/api/events", "GET", { query })
  } catch (_) {
    return;
  }
  searchHost.value = host ? host : "";
  events.value = eventResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

function addDetailed(id: string) {
  detailed.value.push(id);
}

function removeDetailed(id: string) {
  const idx = detailed.value.indexOf(id);
  detailed.value.splice(idx, 1);
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
    <h2>Create an event:</h2>
    <createEventForm @refreshEvents="getEventFeed" />
  </section>
  <div class="row">
    <h2 v-if="!searchHost">Events:</h2>
    <h2 v-else>Events by {{ searchHost }}:</h2>
    <!-- <SearchEventForm @getEventsByHost="getEvents" /> -->
  </div>
  <section class="events" v-if="loaded && events.length !== 0">
    <!-- <EventComponent @seeMoreEventDetails="getEvent"/> -->
    <article v-for="event in events" :key="event._id">
      <EventComponent v-if="editing !== event._id" :event="event" :detailed="detailed" @refreshEvents="getEventFeed" 
      @editEvents="updateEditing" @seeMoreEventDetails="addDetailed" @seeLessEventDetails="removeDetailed"/>
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
