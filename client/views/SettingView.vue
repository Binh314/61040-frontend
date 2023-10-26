<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  if (!confirm("Are you sure you want to delete your account?")) return;
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>

  <div class="pure-grid">
    <div class="pure-u-2-3">
      <main class="column">
        <h1>Settings for {{ currentUsername }}</h1>
        <button class="pure-button pure-button-primary" @click="logout">Logout</button>
        <button class="button-error pure-button" @click="delete_">Delete User</button>
        <UpdateUserForm />
      </main>
    </div>
  </div>
</template>
