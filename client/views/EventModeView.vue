<script setup lang="ts">
// import EventAttendingComponent from "@/components/Event/EventAttendingComponent.vue";
// import EventUpcomingComponent from "@/components/Event/EventUpcomingComponent.vue";
// import PostFeedComponent from "@/components/Post/PostFeedComponent.vue";
import EventModePostFeedComponent from "@/components/EventMode/EventModePostFeedComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn"> </h1>
      <h1 v-else>Please login!</h1>
    </section>
    <div class="pure-grid">
      <div class="pure-u-2-3">
        <h1>Event Mode Home</h1>
        <!-- <PostFeedComponent/> -->
      </div>
      <div class="pure-u-1-3">
        <EventModePostFeedComponent/>
      </div>
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
