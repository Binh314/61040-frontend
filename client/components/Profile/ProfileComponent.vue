<script setup lang="ts">

import { useUserStore } from "@/stores/user";
import { calculateAge } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const props = defineProps(["profile"]);
const emit = defineEmits(["editProfile", "refreshProfile"]);
const { currentUsername } = storeToRefs(useUserStore());


const age = computed(() => {
  const bday = new Date(props.profile.birthdate);
  return calculateAge(bday);
})


</script>


<template>
  <img v-if="props.profile.photo" class="photo" :src="props.profile.photo">
  <h1 class = "name"> {{ props.profile.name }}</h1>
  <p>@{{ props.profile.person.username }}</p>
  <p class = "age" v-if="age"> <font-awesome-icon :icon="['fas', 'id-card']" size="lg" class="icon" /> {{ age }} </p>

  <p class = "location" v-if="profile.location"> 
    <font-awesome-icon :icon="['fas', 'location-dot']" size="lg" class="icon" /> 
      {{props.profile.location}}
  </p>

  <p class="interests" v-if="props.profile.interests.length > 0"> <font-awesome-icon class="icon" :icon="['fas', 'thumbs-up']" size="lg" /> {{  props.profile.interests.join(", ")  }}</p>

  <br>

  <p class="bio" v-if="props.profile.bio">{{ props.profile.bio }}</p>


    <br>

    <menu v-if="props.profile.person.username == currentUsername" class = "options">
      <li><button class="btn-small pure-button" @click="emit('editProfile', props.profile._id)">Edit</button></li>
    </menu>
</template>

<style scoped>

.row {
  display: flex;
  justify-content: flex-start;
  margin: 0 auto;
  max-width: 100%;
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

.user {
  font-weight: normal;
}

h1 {
  margin-top: 0;
  margin-bottom: 0;
}

p {
  margin: 0em;
}

img {
  object-fit: cover;
  width: 25%;
  aspect-ratio: 1;
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
