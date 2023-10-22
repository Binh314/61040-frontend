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
  <p class="bio" v-if="props.profile.bio">{{ props.profile.bio }}</p>

  <h2 class = "user">{{ props.profile.person.username }}</h2>
  <h2 class = "name">{{ props.profile.name }}</h2>
  <br>
  
  <p class = "age" v-if="age"> <font-awesome-icon :icon="['fas', 'id-card']" size="lg" class="icon" /> {{ age }} </p>

  <p class = "location" v-if="profile.location"> 
    <font-awesome-icon :icon="['fas', 'location-dot']" size="lg" class="icon" /> 
      {{props.profile.location}}
  </p>

  <p class="tags" v-if="props.profile.interests.length > 0"> <font-awesome-icon icon="tags" size="lg" class="icon" /> {{  props.profile.interests.join(", ")  }}</p>

  <br>

  <p><img v-if="props.profile.photo" class="photo" :src="props.profile.photo"></p>

    <br>

    <menu v-if="props.profile.person.username == currentUsername" class = "options">
      <li><button class="btn-small pure-button" @click="emit('editProfile', props.profile._id)">Edit</button></li>
    </menu>
</template>

<style scoped>


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
