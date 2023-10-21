<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import EventInfoComponent from "../components/Event/EventInfoComponent.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());


</script>

<template>
  <main>
    <section>
      <h1 v-if="isLoggedIn"></h1>
      <h1 v-else>Please login!</h1>
    </section>
    <EventInfoComponent/>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
