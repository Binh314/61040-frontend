
<script setup lang="ts">

import router from "@/router";
import { useUserStore } from "@/stores/user";
import { calculateAge } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";

const props = defineProps(["profile", "ownProfile"]);
const emit = defineEmits(["editProfile", "refreshProfile"]);
const { currentUsername, eventMode } = storeToRefs(useUserStore());

const commonInterests = ref<Array<string>>([]);

async function goToMessages() {
  void router.push({ name: "Messages", params: {username: props.profile.person} });
}

async function goToProfile() {
  void router.push({ name: "Profile", params: {username: props.profile.person} });
}



const age = computed(() => {
  const bday = new Date(props.profile.birthdate);
  return calculateAge(bday);
})

onBeforeMount( async () => {
  const shared = [];
  for (const interest of props.ownProfile.interests) {
    if (props.profile.interests.includes(interest)) 
      shared.push(interest);
  }
  commonInterests.value = shared;
})


</script>


<template>
  <div class="container">
    <h3>@{{ props.profile.person }}</h3>
    <br>
    <div class="pure-grid">
      <div class="pure-u-1-4">
        <img v-if="props.profile.photo" class="photo" :src="props.profile.photo" @click.stop="goToProfile">
        <img v-else class="photo" src="@/assets/images/user-solid.png" @click.stop="goToProfile"/>
      </div>
      <div class="pure-u-3-4">
        <h1 class = "name">
          <span class="names" @click.stop="goToProfile">
            {{ props.profile.name }}
          </span>

          <font-awesome-icon v-if="props.profile.person.username !== currentUsername" class="message" :icon="['far', 'envelope']" size="lg" @click.stop="goToMessages" />
        </h1>
        <br>
        <h2 class="commonInterests" v-if="commonInterests.length > 0" ><font-awesome-icon class="icon" :icon="['fas', 'heart']" size="lg" /> also likes {{  commonInterests.join(", ")  }}</h2>
        <br>
        <p class = "age" v-if="age"> <font-awesome-icon :icon="['fas', 'id-card']" size="lg" class="icon" /> {{ age }} </p>

        <p class = "location" v-if="profile.location && props.ownProfile === undefined"> 
            <font-awesome-icon :icon="['fas', 'location-dot']" size="lg" class="icon" /> 
            {{props.profile.location}}
        </p>

        <p class="interests" v-if="props.profile.interests.length > 0"> <font-awesome-icon class="icon" :icon="['fas', 'thumbs-up']" size="lg" /> {{  props.profile.interests.join(", ")  }}</p>
        <br>
        <p class="bio" v-if="props.profile.bio && props.ownProfile === undefined">{{ props.profile.bio }}</p>
        
        <br>
      </div>
    </div>
    <br>
    <menu v-if="props.profile.person == currentUsername" class = "options">
      <li><button class="pure-button pure-button-primary" @click="emit('editProfile', props.profile._id)">Edit Profile</button></li>
    </menu>
  </div>
</template>

<style scoped>

.username {
  font-size:large;
  font-weight:normal;
}

.names:hover {
  text-decoration: underline;
  cursor:pointer;
}

.photo:hover {
  cursor:pointer;
}

.commonInterests {
  font-weight: bold;
}
.message {
  margin-left: 0.5em;
}

.message:hover {
  cursor:pointer
}
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

h1, h2, h3 {
  margin-top: 0;
  margin-bottom: 0;
}

p {
  margin: 0em;
  line-height: 2em;
  white-space: pre;
}

img {
  object-fit: cover;
  width: 90%;
  aspect-ratio: 1;
  border-radius: 1em;
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
