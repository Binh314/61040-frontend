<script setup lang="ts">

import router from "@/router";
import { formatDateShort } from "@/utils/formatDate";
import { computed } from "vue";
import { useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const props = defineProps(["event"]);
const emit = defineEmits(["refreshEvent"])

const futureEvent = computed(() => {
  return new Date(props.event.startTime) > new Date();
});

async function getEventPage() {
  void router.push({ name: "Event", params: {id: props.event._id} });
  emit("refreshEvent", props.event._id);
}


</script>


<template>
  <article class="container" @click="getEventPage">
    <p class = "title">{{ props.event.title }}</p>
    <p class = "time" v-if="futureEvent">
      <font-awesome-icon :icon="['fas', 'calendar']" size="lg" class="icon" />
      {{ formatDateShort(props.event.startTime) }}
    </p>
    <p class = "time" v-else>
      <font-awesome-icon :icon="['fas', 'calendar']" size="lg" class="icon" />
      Happening Right Now!
    </p>
    <p class = "location"> 
      <font-awesome-icon :icon="['fas', 'location-dot']" size="lg" class="icon" /> <a :href="`http://maps.google.com/?q=${event.location}`" target="_blank">
        {{event.location}}
      </a> 
    </p>
  </article>
</template>

<style scoped>
article:hover {
  background-color: darkgray;
  cursor:pointer;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}


label {
  padding-top: 1em;
}
.icon {
  width: 1em;
}
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
.row {
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 0
}
</style>
