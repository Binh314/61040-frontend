<script setup lang="ts">
import EditEventForm from "@/components/Event/EditEventForm.vue";
import EventAttendingComponent from "@/components/Event/EventAttendingComponent.vue";
import EventComponent from "@/components/Event/EventComponent.vue";
import EventHostingComponent from "@/components/Event/EventHostingComponent.vue";
import EventInterestedComponent from "@/components/Event/EventInterestedComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import router from "../../router";
const { isLoggedIn } = storeToRefs(useUserStore());

// const currentRoute = ref(useRoute());
// const currentRouteName = computed(() => currentRoute.value.name);

const loaded = ref(false);
let events = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let detailed = ref<Array<string>>([]);

watch(async () => router.currentRoute.value.params.id, 
  async newId => { 
    const id = await newId;
    if (typeof id === "string") 
      await getEventById(id);
    }
);
    
async function getEvent() {
  let eventResults;
  try {
    const id = useRoute().params.id;
    eventResults = await fetchy(`/api/events/id/${id}`, "GET")
  } catch (_) {
    return;
  }
  events.value = eventResults;
}

async function getEventById(id: string) {
  let eventResults;
  try {
    eventResults = await fetchy(`/api/events/id/${id}`, "GET")
  } catch (_) {
    return;
  }
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
  await getEvent();
  loaded.value = true;
});


</script>

<template>
  <div class="pure-grid">
      <div class="pure-u-2-3">
          <div class="row">
            <h2>Event</h2>
          </div>
          <section class="events" v-if="loaded && events.length !== 0">
            <!-- <EventComponent @seeMoreEventDetails="getEvent"/> -->
            <article v-for="event in events" :key="event._id">
              <EventComponent v-if="editing !== event._id" :event="event" :detailed="detailed" @refreshEvents="getEvent()"
              @editEvent="updateEditing" @seeMoreEventDetails="addDetailed" @seeLessEventDetails="removeDetailed"/>
              <EditEventForm v-else :event="event" @refreshEvents="getEvent()" @editEvent="updateEditing" />
            </article>
          </section>
          <p v-else-if="loaded">No events found</p>
          <p v-else>Loading...</p>
      </div>
      <div class="pure-u-1-3">
        <EventAttendingComponent/>
        <EventInterestedComponent/>
        <EventHostingComponent/>
      </div>
  </div>
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
