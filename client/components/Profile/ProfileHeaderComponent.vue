<script setup lang="ts">

import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRoute, } from "vue-router";



const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());
const currentRoute = useRoute();
const props = defineProps(["username"]);

let profile = ref<Record<string, string>>({});

async function goToMessages() {
  if (!isLoggedIn.value) return;
  void router.push({ name: "Messages", params: {username: props.username} });
}

async function getProfile() {
  let profileResult;
  try {
    profileResult = await fetchy(`/api/profile/user/${props.username}`, "GET")
  } catch (_) {
    return;
  }
  profile.value = profileResult;
}

async function goToProfile() {
  void router.push({ name: "Profile", params: {username: props.username} });
}

onBeforeMount(async () => {
  await getProfile();
});
</script>

<template>
  <div class="header">
    <span class="profile"  @click.stop="goToProfile">
      <span class="name"> {{ profile.name }} </span>
      <span class="username"> @{{ props.username }} </span>
    </span>
    <font-awesome-icon v-if="username !== currentUsername && isLoggedIn" class="icon" :icon="['far', 'envelope']" size="lg" @click.stop="goToMessages" />
  </div>
</template>

<style scoped>

.icon {
  margin-left: 0.5em;
}

.icon:hover {
  cursor:pointer
}

.profile:hover {
  cursor: pointer;
  text-decoration: underline;
}

.username {
  font-size: smaller
}

.name {
  font-weight: bold;
}

img {
  object-fit: cover;
  height: 2em;
  aspect-ratio: 1;
  padding-right: 0.5em;
}


article:hover {
  background-color: darkgray;
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
