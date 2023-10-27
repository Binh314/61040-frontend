<script setup lang="ts">
import EventFeedComponent from "@/components/Event/EventFeedComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <div class="pure-grid" v-if="!isLoggedIn">
      <div class="pure-u-2-3">
        <section>
          <h1>Please login!</h1>
        </section>
      </div>
    </div>
    <EventFeedComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
