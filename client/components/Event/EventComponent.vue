<script setup lang="ts">

import { useUserStore } from "@/stores/user";
import { formatDate, formatEventDate, formatTime } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["event", "detailed"]);
const emit = defineEmits(["editEvent", "refreshEvents", "seeMoreEventDetails", "seeLessEventDetails"]);
const { currentUsername } = storeToRefs(useUserStore());

const addEventActive = ref(false);

const interestedInEvent = computed(() => props.event.interested.includes(currentUsername.value));
const attendingEvent = computed(() => props.event.attending.includes(currentUsername.value));

const dropdownText = computed(() => {
  if (addEventActive.value) return "Not Interested";
  else if (interestedInEvent.value) return "Interested";
  else if (attendingEvent.value) return "Attending";
  else return "Add Event";
});

const deleteEvent = async () => {
  try {
    await fetchy(`/api/events/${props.event._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshEvents");
};

const toggleDropdown = async () => {
  if (addEventActive.value && (interestedInEvent.value || attendingEvent.value)) 
    await removeInterest();
  addEventActive.value = !addEventActive.value;
}

const removeInterest = async () => {
  try {
    await fetchy(`/api/events/${props.event._id}/removeUser`, "PATCH")
  } catch (_) {
    return;
  }
  emit("refreshEvents");
}

const indicateInterest = async () => {
  if (!interestedInEvent.value)
    try {
      await fetchy(`/api/events/${props.event._id}/interest/add`, "PATCH")
    } catch (_) {
      return;
    }
  addEventActive.value = false;
  emit("refreshEvents");
}

const indicateAttendance = async () => {
  if (!attendingEvent.value)
    try {
      await fetchy(`/api/events/${props.event._id}/attendance/add`, "PATCH")
    } catch (_) {
      return;
    }
  addEventActive.value = false;
  emit("refreshEvents");
}



</script>


<template @click="emit('seeMoreEventDetails', props.event._id)">
  <h2 class = "host">{{ props.event.host }}</h2>
  <h2 class = "title">{{ props.event.title }}</h2>

  <br>

  <!-- Source https://stackoverflow.com/questions/27419509/open-google-map-with-specific-address-in-a-browser -->
  <p class = "location"> <a :href="`http://maps.google.com/?q=${event.location}`" target="_blank">{{event.location}}</a> </p>
  <p class = "time" v-if="formatDate(props.event.startTime).split(' ')[0] === formatDate(props.event.endTime).split(' ')[0]">
    {{ formatEventDate(props.event.startTime) }} &ndash;  {{ formatTime(props.event.endTime) }}
  </p>
  <p class = "time" v-else>
    {{ formatEventDate(props.event.startTime) }} &ndash;  {{ formatEventDate(props.event.endTime) }}
  </p>
  <p class = "age" v-if="event.ageReq"> <b>Ages</b> {{ props.event.ageReq }}+ </p>

  <p class="tags" v-if="event.topics.length > 0"><b>Topics:</b> {{  props.event.topics.join(", ")  }}</p>

  <p v-if="event.photo"><img class="photo" :src="event.photo"></p>

  <br>

  <template v-if="detailed.includes(event._id)">
    <label for="description" v-if="event.description"><b>Description:</b></label>
    <p class = "description" v-if="event.description"> {{ props.event.description }} </p>

    <br>

    <p class="tags" v-if="event.amenities.length > 0"> <b>Amenities:</b> {{  props.event.amenities.join(", ")  }}</p>
    <p class="tags" v-if="event.accommodations.length > 0"> <b>Accommodations:</b> {{  props.event.accommodations.join(", ")  }}</p>

    <br>

    <p class = "stuff" v-if="event.attending.length > 0"> <b>Attendees:</b> {{ props.event.attending.join(", ") }}</p>
    <p class = "stuff" v-if="event.interested.length > 0"> <b>Interested:</b> {{ props.event.interested.join(", ") }}</p>
    <p class = "capacity"><b>Capacity: </b>{{ props.event.attending.length }} / {{ props.event.capacity }}</p>
  </template>
    <menu>
      <li>
        <button class="btn-small pure-button" @click="emit('seeMoreEventDetails', props.event._id)" 
          v-if="!detailed.includes(event._id)">
          See More Details
        </button>
        <button class="btn-small pure-button" @click="emit('seeLessEventDetails', props.event._id)" 
          v-else>
          See Less Details
        </button>
      </li>
    </menu>

    <br>

    <menu v-if="props.event.host == currentUsername" class = "options">
      <li><button class="btn-small pure-button" @click="emit('editEvent', props.event._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteEvent">Delete</button></li>
    </menu>
    <div v-else class="dropdownBox">
      <div class="addEvent">
        <button class="pure-button dropdownButton" @click="toggleDropdown">{{ dropdownText }}</button>
        <div class="dropdownOptions" v-if="addEventActive">
          <button class="pure-button dropdownButton" @click="indicateInterest">Interested</button> <br/>
          <button class="pure-button dropdownButton" @click="indicateAttendance">Attending</button>
        </div>
      </div>
    </div>
    <article class="timestamp">
      <p v-if="props.event.dateCreated !== props.event.dateUpdated">Edited on: {{ formatDate(props.event.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.event.dateCreated) }}</p>
    </article>
</template>

<style scoped>

.dropdownButton {
  width: 10em;
}

.host {
  font-weight: normal;
}

h2 {
  margin-top: 0;
  margin-bottom: 0;
}
p {
  margin: 0em;
}

.photo{
  max-width: 75%;
}

.title {
  font-weight: bold;
}

.options {
  display: flex;
  justify-content: space-between;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
