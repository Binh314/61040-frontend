<script setup lang="ts">
import TagsInput from "@/components/Global/TagsInput.vue";
import { formatDate, formatDatepick, toDateString } from "@/utils/formatDate";
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["event"]);
const emit = defineEmits(["refreshEvents", "editEvent"]);


const title = ref(props.event.title);
const photo = ref(props.event.photo);
const location = ref(props.event.location);
const description = ref(props.event.description);
const ageReq = ref(props.event.ageReq);
const capacity = ref(props.event.capacity);
const startTime = ref(formatDatepick(props.event.startTime));
const endTime = ref(formatDatepick(props.event.endTime));
const topics = ref<Array<string>>(props.event.topics);
const amenities = ref<Array<string>>(props.event.amenities);
const accommodations = ref<Array<string>>(props.event.accommodations);

const startPick = ref(null);
const endPick = ref(null);

console.log(props.event.topics.value)

function updateTopics(tags: string[]) {
//   topics.value.length = 0; // clear array
//   topics.value.push(...tags);
}

function updateAmenities(tags: string[]) {
//   console.log('amenities');
//   console.log(tags);
//   amenities.value.length = 0; // clear array
//   amenities.value.push(...tags);
}

function updateAccommodations(tags: string[]) {
//   accommodations.value.length = 0; // clear array
//   accommodations.value.push(...tags);
}

onMounted(() => {
  console.log(startTime.value);
});



const editEvent = async(title: string, location: string, description: string, capacity: string, startDate: string, endDate: string, ageReq: string, photo: string, topics: string[], amenities: string[], accommodations: string[]) => {
  console.log('triggered');
  try {
    const startTime = toDateString(startDate);
    const endTime = toDateString(endDate);
    await fetchy(`/api/events/${props.event._id}/edit`, "PATCH", 
      { body: { update: 
        { title: title,
          location: location,
          description: description,
          capacity: capacity,
          ageReq: ageReq, 
          photo: photo,
          topics: topics,
          amenities: amenities,
          accommodations: accommodations
        },
        startTime: startTime,
        endTime: endTime,
      } 
    });
  } catch (e) {
    return;
  }
  emit("editEvent");
  emit("refreshEvents");
}
</script>


<template>
  <form @submit.prevent="editEvent(title, location, description, capacity, startTime, endTime, ageReq, photo, topics, amenities, accommodations)">
    <label for="title">Title:</label>
    <input id="title" v-model="title" placeholder="event title" required @keypress.enter.prevent> 

    <label for="location">Location:</label>
    <input id="location" v-model="location" placeholder="address or location name" required @keypress.enter.prevent>

    <label for="startTime">Start Time:</label>
    <input ref="startPick" type="datetime-local" v-model="startTime" id="startTime" name="start-time" required @keypress.enter.prevent/>

    <label for="endTime">End Time:</label>
    <input ref="endPick" type="datetime-local" v-model="endTime" id="endTime" name="end-time" required @keypress.enter.prevent/>

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

    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editEvent')">Cancel</button></li>
      </menu>
      <p v-if="props.event.dateCreated !== props.event.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.event.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.event.dateCreated) }}</p>
    </div>
    </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
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

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
