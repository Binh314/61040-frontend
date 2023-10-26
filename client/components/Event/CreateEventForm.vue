<script setup lang="ts">
import TagsInput from "@/components/Global/TagsInput.vue";
import { formatDatepick, toDateString } from "@/utils/formatDate";
import { ref } from "vue";
import { useToastStore } from "../../stores/toast";
import { fetchy } from "../../utils/fetchy";

const title = ref("");
const photo = ref("");
const location = ref("");
const description = ref("");
const ageReq = ref("");
const capacity = ref("");
const startTime = ref(formatDatepick(new Date()))
const endTime = ref(formatDatepick(new Date()))
const topics = ref<Array<string>>(['',]);
const amenities = ref<Array<string>>(['',]);
const accommodations = ref<Array<string>>(['',]);
const emit = defineEmits(["refreshEvents"]);

const topicString = ref("topic")
const amenityString = ref("amenity")
const accommodationString = ref("accommodation")

const createEvent = async (title: string, location: string, description: string, capacity: string, startDate: string, endDate: string, ageReq: string, photo: string, topics: string[], amenities: string[], accommodations: string[]) => {
  try {

    if (Date.parse(startDate) > Date.parse(endDate)) {
      useToastStore().showToast({ message: "End time needs to be later than start time.", style: "error" });
      return;
    }
    
    const startTime = toDateString(startDate);
    const endTime = toDateString(endDate);

    topics.filter(e=>e);
    amenities.filter(e=>e);
    accommodations.filter(e=>e);
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
    <label for="title"> Title </label>
    <input id="title" v-model="title" placeholder="event title" required @keypress.enter.prevent autocomplete="off"/> 

    <label for="startTime"> 
      <!-- <font-awesome-icon :icon="['fas', 'calendar']" size="lg" class="icon" />  -->
      Start Time
    </label>
    <input type="datetime-local" v-model="startTime" id="startTime" name="start-time" required @keypress.enter.prevent autocomplete="off"/>

    <label for="endTime"> 
      <!-- <font-awesome-icon :icon="['fas', 'calendar']" size="lg" class="icon" />  -->
      End Time
    </label>
    <input type="datetime-local" v-model="endTime" id="endTime" name="end-time" required @keypress.enter.prevent autocomplete="off"/>

    <label for="location"> 
      <!-- <font-awesome-icon :icon="['fas', 'location-dot']" size="lg" class="icon" />  -->
      Location
    </label>
    <input id="location" v-model="location" placeholder="address or location name" required @keypress.enter.prevent autocomplete="off"/>

    <label for="ageReq">
      <!-- <font-awesome-icon :icon="['fas', 'id-card']" size="lg" class="icon" /> -->
      Age Requirement
    </label>
    <input id="ageReq" v-model="ageReq" placeholder="age requirement (leave empty for no age restriction)" maxlength="2" @keypress.enter.prevent autocomplete="off"/>

    <label for="capacity">
      <!-- <font-awesome-icon :icon="['fas', 'people-group']" size="lg" class="icon"/> -->
      Capacity
    </label>
    <input id="capacity" v-model="capacity" placeholder="maximum number of attendees" required @keypress.enter.prevent autocomplete="off"/>


    <label for="description">
      Description
    </label>
    <textarea id="description" v-model="description" placeholder="description of event"> </textarea>

    <label for="topicsInput">
      <!-- <font-awesome-icon icon="tags" size="lg" class="icon" /> -->
      Topics
    </label>
    <TagsInput id="topicsInput" :initTags="topics" :tagName="topicString" @updateTags="updateTopics"/>

    <label for="amenitiesInput">
      <!-- <font-awesome-icon :icon="['fas', 'wifi']" size="lg" class="icon"/> -->
      Amenities
    </label>
    <TagsInput id="amenitiesInput" :initTags="amenities" :tagName="amenityString" @updateTags="updateAmenities"/>

    <label for="accommodationsInput">
      <!-- <font-awesome-icon :icon="['fab', 'accessible-icon']" size="lg" class="icon" /> -->
      Accommodations
    </label>
    <TagsInput id="accommodationsInput" :initTags="accommodations" :tagName="accommodationString" @updateTags="updateAccommodations"/>

    <label for="photo">
      <!-- <font-awesome-icon :icon="['fas', 'image']" size="lg" class="icon"/> -->
      Photo
    </label>
    <input id="photo" v-model="photo" placeholder="url of photo for event" @keypress.enter.prevent autocomplete="off"/> 

    <menu>
        <li><button type="submit" class="pure-button-primary pure-button">Create Event</button></li>
        <li><button class="btn-small pure-button" @click="emit('refreshEvents')">Cancel</button></li>
      </menu>
  </form>
</template>

<style scoped>

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}
.icon {
  width: 1em;
}

label {
  padding-top: 1em;
}

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
