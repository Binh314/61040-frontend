<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["event"]);
const emit = defineEmits(["editEvent", "refreshEvents"]);
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

<template>
  <p class="author">{{ props.event.author }}</p>
  <h2 class = "title">{{ props.event.title }}</h2>
  <p v-if="event.photo"><img class = "photo" :src="event.photo"></p>
  <p class = "age"> <b>Age Requirement:</b> {{ event.ageReq }} </p>
  <p class = "capacity"><b>Capacity: </b>{{ event.attending.length }} / {{ event.capacity }}</p>
  <p class = "description" v-if="event.description > 0"><b>Description:</b>{{ props.event.description }}</p>
  <p class = "time"><b>Start Time: </b>{{ formatDate(props.event.startTime) }}</p>
  <p class = "time"><b>End Time: </b>{{ formatDate(props.event.endTime) }}</p>
  <p class="tags" v-if="event.topics.length > 0"><b>Topics:</b> {{  props.event.topics.join(", ")  }}</p>
  <p class="tags" v-if="event.amenities.length > 0"><b>Amenities:</b> {{  props.event.amenities.join(", ")  }}</p>
  <p class="tags" v-if="event.accommodations.length > 0"><b>Accommodations:</b> {{  props.event.accommodations.join(", ")  }}</p>
    <menu v-if="props.event.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editEvent', props.event._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteEvent">Delete</button></li>
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

.author {
  font-weight: bold;
  font-size: 1.2em;
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
