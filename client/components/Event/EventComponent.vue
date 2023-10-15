<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate, formatEventDate, formatTime } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["event", "detailed"]);
const emit = defineEmits(["editEvent", "refreshEvents", "seeMoreEventDetails", "seeLessEventDetails"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteEvent = async () => {
  try {
    await fetchy(`/api/posts/${props.event._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshEvents");
};



</script>


<template @click="emit('seeMoreEventDetails', props.event._id)">
  <h2 class = "host">{{ props.event.host }}</h2>
  <h2 class = "title">{{ props.event.title }}</h2>
  <!-- Source https://stackoverflow.com/questions/27419509/open-google-map-with-specific-address-in-a-browser -->
  <p class = "location"> <b>Location:</b> <a :href="`http://maps.google.com/?q=${event.location}`" target="_blank">{{event.location}}</a> </p>
  <p class = "time" v-if="formatDate(props.event.startTime).split(' ')[0] === formatDate(props.event.endTime).split(' ')[0]">
    <b>Time: </b>{{ formatEventDate(props.event.startTime) }} &ndash;  {{ formatTime(props.event.endTime) }}
  </p>
  <p class = "time" v-else>
    <b>Time: </b>{{ formatEventDate(props.event.startTime) }} &ndash;  {{ formatEventDate(props.event.endTime) }}
  </p>
  <p class = "age" v-if="event.ageReq"> <b>Age Requirement:</b> {{ props.event.ageReq }} </p>

  <p v-if="event.photo"><img class = "photo" :src="event.photo"></p>

  <p class = "description" v-if="event.description > 0"><b>Description:</b>{{ props.event.description }}</p>
  <p class="tags" v-if="event.topics.length > 0"><b>Topics:</b> {{  props.event.topics.join(", ")  }}</p>
  <p class="tags" v-if="event.amenities.length > 0"><b>Amenities:</b> {{  props.event.amenities.join(", ")  }}</p>
  <p class="tags" v-if="event.accommodations.length > 0"><b>Accommodations:</b> {{  props.event.accommodations.join(", ")  }}</p>
  <template v-if="detailed.includes(event._id)">
    <p class = "stuff" v-if="event.attending.length > 0"><b>Attendees:</b> {{ props.event.attending.join(", ") }}</p>
    <p class = "stuff" v-if="event.interested.length > 0"><b>Interested:</b> {{ props.event.interested.join(", ") }}</p>
    <p class = "capacity"><b>Capacity: </b>{{ props.event.attending.length }} / {{ props.event.capacity }}</p>
  </template>
    <menu v-if="props.event.host == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editEvent', props.event._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteEvent">Delete</button></li>
    </menu>
    <menu v-else>
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
    <article class="timestamp">
      <p v-if="props.event.dateCreated !== props.event.dateUpdated">Edited on: {{ formatDate(props.event.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.event.dateCreated) }}</p>
    </article>
</template>

<style scoped>
p {
  margin: 0em;
}

.photo{
  max-height: 25vw;
}

.title {
  font-weight: bold;
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
