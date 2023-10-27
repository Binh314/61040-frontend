<script setup lang="ts">
import createEventForm from "@/components/Event/CreateEventForm.vue";
import EditEventForm from "@/components/Event/EditEventForm.vue";
import EventAttendingComponent from "@/components/Event/EventAttendingComponent.vue";
import EventComponent from "@/components/Event/EventComponent.vue";
import EventHostingComponent from "@/components/Event/EventHostingComponent.vue";
import EventInterestedComponent from "@/components/Event/EventInterestedComponent.vue";
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
let creating = ref(false);
const componentKey = ref(1);

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
  creating.value = false;
  componentKey.value =  componentKey.value * -1;
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
  events.value = eventResults.filter((event: {endTime: any}) => Date.parse(event.endTime) > Date.now());
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

function createEvent() {
  creating.value = true;
}

onBeforeMount(async () => {
  if (isLoggedIn.value) {
    await getEventFeed();
  } else {
    await getEvents();
  }
  loaded.value = true;
});
</script>

<template>
  <div class="pure-grid">
    <div class="pure-u-2-3">
      <h1>Events</h1>
      <div v-if="creating">
        <section class="formArea" v-if="isLoggedIn">
            <h2>Create an event:</h2>
            <createEventForm @refreshEvents="getEventFeed" />
        </section>
      </div>
      <div v-else>
        <!-- <div class="row">
          <h2 v-if="!searchHost"></h2>
          <h2 v-else> {{ searchHost }}:</h2> -->
          <!-- <SearchEventForm @getEventsByHost="getEvents" /> -->
        <!-- </div> -->
        <button class="pure-button pure-button-primary create" @click="createEvent" v-if="isLoggedIn" >Create an Event</button>
        <section class="events" v-if="loaded && events.length !== 0">
          <!-- <EventComponent @seeMoreEventDetails="getEvent"/> -->
          <article v-for="event in events" :key="event._id">
            <EventComponent v-if="editing !== event._id" :event="event" :detailed="detailed" @refreshEvents="getEventFeed"
            @editEvent="updateEditing" @seeMoreEventDetails="addDetailed" @seeLessEventDetails="removeDetailed"/>
            <EditEventForm v-else :event="event" @refreshEvents="getEventFeed" @editEvent="updateEditing" />
          </article>
        </section>
        <p v-else-if="loaded">No events found</p>
        <p v-else>Loading...</p>
      </div>
    </div>
    <div class="pure-u-1-3">
      <EventAttendingComponent :key="componentKey"/>
      <EventInterestedComponent :key="componentKey"/>
      <EventHostingComponent :key="componentKey"/>
    </div>
  </div>
</template>

<style scoped>

.create {
  margin-left: 1em;
  margin-bottom: 2em;
}

section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

h1 {
  text-align: center;
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
