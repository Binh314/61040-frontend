<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
void router.push({ name: "Event", params: {id: "652c98e1dedae962fc7cb38f"}});

</script>

<template>
  <main>
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
