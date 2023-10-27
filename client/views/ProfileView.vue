<script setup lang="ts">
import EventAttendingComponent from "@/components/Event/EventAttendingComponent.vue";
import EventUpcomingComponent from "@/components/Event/EventUpcomingComponent.vue";
import ProfileInfoComponent from "@/components/Profile/ProfileInfoComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn, eventMode } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <div class="pure-grid" v-if="!isLoggedIn">
      <div class="pure-u-2-3">
        <section>
          <h1 >Please login!</h1>
        </section>
      </div>
    </div>
    <div class="pure-grid">
      <div class="pure-u-2-3">
        <h1>Profile</h1>
        <ProfileInfoComponent/>
      </div>
      <div class="pure-u-1-3">
        <EventAttendingComponent v-if="!eventMode"/>
        <EventUpcomingComponent v-if="!eventMode"/>
      </div>
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
