<script setup lang="ts">
import TestComponent from "@/components/Global/TagsInput.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <TestComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
main {
  display: flex;
  justify-content: center;
}
</style>
