<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import ProfileComponent from "../Profile/ProfileComponent.vue";

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false);
let profiles = ref<Array<Record<string, string>>>([]);
let ownProfile = ref<Record<string, string>>();
const componentKey = ref(1);

async function getProfilesFeed() {
  let profileResults;
  try {
    profileResults = await fetchy("/api/feed/eventmode/profiles", "GET")
  } catch (_) {
    return;
  }
  profiles.value = profileResults;
}

async function getProfile() {
  let profileResult;
  try {
    profileResult = await fetchy(`/api/profile/user/${currentUsername.value}`, "GET")
  } catch (_) {
    return;
  }
  ownProfile.value = profileResult;
  componentKey.value = componentKey.value * -1; // reload sidebar
}



onBeforeMount(async () => {
  if (isLoggedIn) {
    await getProfilesFeed();
    await getProfile();
  } else {
    profiles.value = [];
  }
  loaded.value = true;
});
</script>

<template>
  <section class="profiles" v-if="loaded && profiles.length !== 0">
    <!-- <EventComponent @seeMoreEventDetails="getEvent"/> -->
    <article v-for="profile in profiles" :key="profile._id">
      <ProfileComponent :profile="profile" :ownProfile="ownProfile" @refreshProfiles="getProfilesFeed"/>
    </article>
  </section>
  <p v-else-if="loaded">No events found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  /* max-width: 60em; */
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.events {
  padding: 1em;
}

.formArea {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 1em
}
</style>
