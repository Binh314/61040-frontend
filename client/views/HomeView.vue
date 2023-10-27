<script setup lang="ts">
import EventAttendingComponent from "@/components/Event/EventAttendingComponent.vue";
import EventUpcomingComponent from "@/components/Event/EventUpcomingComponent.vue";
import PostFeedComponent from "@/components/Post/PostFeedComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import router from "../router";

const { currentUsername, isLoggedIn, eventMode } = storeToRefs(useUserStore());
onBeforeMount(() => {
  if (eventMode.value) 
    router.push({name: "EventMode"});
})
</script>

<template>
  <main>
    <div class="pure-grid">
      <div class="pure-u-2-3">
        <section>
          <h1 v-if="isLoggedIn"> </h1>
          <h1 v-else>Please login!</h1>
        </section>
        <h1>Home</h1>
        <PostFeedComponent/>
      </div>
      <div class="pure-u-1-3">
        <EventAttendingComponent/>
        <EventUpcomingComponent/>
      </div>
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
