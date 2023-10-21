<script setup lang="ts">
import EventAttendingComponent from "@/components/Event/EventAttendingComponent.vue";
import EventFeedComponent from "@/components/Event/EventFeedComponent.vue";
import EventHostingComponent from "@/components/Event/EventHostingComponent.vue";
import EventInterestedComponent from "@/components/Event/EventInterestedComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <div class="pure-grid">
    <div class="pure-u-2-3">
    <main>
      <h1>Events Feed</h1>
      <section>
        <h1 v-if="isLoggedIn"></h1>
        <h1 v-else>Please login!</h1>
      </section>
      <EventFeedComponent />
    </main>
    </div>
    <div class="pure-u-1-3">
      <EventAttendingComponent/>
      <EventInterestedComponent/>
      <EventHostingComponent/>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
