<script setup lang="ts">
import TagsInput from "@/components/Global/TagsInput.vue";
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
const topics = ref<Array<string>>([]);
const amenities = ref<Array<string>>([]);
const accommodations = ref<Array<string>>([]);
const emit = defineEmits(["refreshEvents"]);

const createEvent = async (title: string, location: string, description: string, capacity: string, startDate: string, endDate: string, ageReq: string, photo: string, topics: string[], amenities: string[], accommodations: string[]) => {
  try {
    const startTime = toDateString(startDate);
    const endTime = toDateString(endDate);
    // if (new Date(startTime) > new Date(endTime)) throw new Error("The end time needs to be later than the start time.");
    await fetchy("/api/events", "POST", {
      body: { title, location, description, capacity, ageReq, photo, startTime, endTime, topics, amenities, accommodations },
    });
  } catch (_) {
    return;
  }
  emit("refreshEvents");
  emptyForm();
};

function updateTopics(tags: string[]) {
  // topics.value.length = 0; // clear array
  // topics.value.push(...tags);
}

function updateAmenities(tags: string[]) {
  // console.log('amenities');
  // console.log(tags);
  // amenities.value.length = 0; // clear array
  // amenities.value.push(...tags);
}

function updateAccommodations(tags: string[]) {
  // accommodations.value.length = 0; // clear array
  // accommodations.value.push(...tags);
}

const emptyForm = () => {
  title.value = "";
  photo.value = "";
  location.value = "";
  description.value = "";
  ageReq.value = "";
  capacity.value = "";
  startTime.value = "";
  endTime.value = "";
  topics.value.length = 0;
  amenities.value.length = 0;
  accommodations.value.length = 0;
};
</script>

<!-- Source for Preventing Submission on Enter:
  https://stackoverflow.com/questions/31070479/prevent-form-submitting-when-pressing-enter-from-a-text-input-using-vue-js -->

<template>
  <form @submit.prevent="createEvent(title, location, description, capacity, startTime, endTime, ageReq, photo, topics, amenities, accommodations)">
    <label for="title">Title:</label>
    <input id="title" v-model="title" placeholder="event title" required @keypress.enter.prevent> 

    <label for="location">Location:</label>
    <input id="location" v-model="location" placeholder="address or location name" required @keypress.enter.prevent>

    <label for="startTime">Start Time:</label>
    <input type="datetime-local" v-model="startTime" id="startTime" name="start-time" required @keypress.enter.prevent/>

    <label for="endTime">End Time:</label>
    <input type="datetime-local" v-model="endTime" id="endTime" name="end-time" required @keypress.enter.prevent/>

    <label for="ageReq">Age Requirement:</label>
    <input id="ageReq" v-model="ageReq" placeholder="age requirement (leave empty for no age restriction)" maxlength="2" @keypress.enter.prevent>

    <label for="capacity">Capacity:</label>
    <input id="capacity" v-model="capacity" placeholder="maximum number of people who can be at the event" @keypress.enter.prevent>


    <label for="description">Description:</label>
    <textarea id="description" v-model="description" placeholder="description of event"> </textarea>

    <label for="topicsInput">Topics:</label>
    <TagsInput id="topicsInput" :initTags="topics" @updateTags="updateTopics"/>

    <label for="amenitiesInput">Amenities:</label>
    <TagsInput id="amenitiesInput" :initTags="amenities" @updateTags="updateAmenities"/>

    <label for="accommodationsInput">Accommodations:</label>
    <TagsInput id="accommodationsInput" :initTags="accommodations" @updateTags="updateAccommodations"/>

    <label for="photo">Photo:</label>
    <input id="photo" v-model="photo" placeholder="url of photo for event" @keypress.enter.prevent> 

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
