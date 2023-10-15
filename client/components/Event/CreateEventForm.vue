<script setup lang="ts">
import { toDateString } from "@/utils/formatDate";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const title = ref("");
const photo = ref("");
const location = ref("");
const description = ref("");
const ageReq = ref("");
const capacity = ref("");
const startTime = ref("")
const endTime = ref("")
const topics = ref("");
const amenities = ref("");
const accommodations = ref("");
const emit = defineEmits(["refreshEvents"]);

const createEvent = async (title: string, location: string, description: string, capacity: string, startDate: string, endDate: string, ageReq: string, photo: string) => {
  try {
    const startTime = toDateString(startDate);
    const endTime = toDateString(endDate);
    await fetchy("/api/events", "POST", {
      body: { title, location, description, capacity, ageReq, photo, startTime, endTime },
    });
  } catch (_) {
    return;
  }
  emit("refreshEvents");
  emptyForm();
};

const emptyForm = () => {
  title.value = "";
};
</script>

<template>
  <form @submit.prevent="createEvent(title, location, description, capacity, startTime, endTime, ageReq, photo)">
    <label for="title">Title:</label>
    <input id="title" v-model="title" placeholder="event title" required> 

    <label for="location">Location:</label>
    <input id="location" v-model="location" placeholder="address or location name" required>

    <label for="startTime">Start Time:</label>
    <input type="datetime-local" v-model="startTime" id="startTime" name="start-time" required/>

    <label for="endTime">End Time:</label>
    <input type="datetime-local" v-model="endTime" id="endTime" name="end-time" required/>

    <label for="ageReq">Age Requirement:</label>
    <input id="ageReq" v-model="ageReq" placeholder="age requirement (leave empty for no age restriction)" maxlength="2">

    <label for="capacity">Capacity:</label>
    <input id="capacity" v-model="capacity" placeholder="maximum number of people who can be at the event">


    <label for="description">Description:</label>
    <textarea id="description" v-model="description" placeholder="description of event"> </textarea>

    <label for="photo">Photo:</label>
    <input id="location" v-model="photo" placeholder="url of photo for event"> 

    <button type="submit" class="pure-button-primary pure-button">Create Event</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
