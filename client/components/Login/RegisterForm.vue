<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const address = ref("");
const submitText = ref("Register");
const { createUser, loginUser, updateSession, loginUserCoords } = useUserStore();

async function register() {
  if (address.value) {
    await createUser(username.value, password.value);
    await loginUser(username.value, password.value, address.value);
    void updateSession();
    void router.push({ name: "Home" });
  } else {
    submitText.value = "Registering...";
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const location = pos.coords;
      const latitude = location.latitude;
      const longitude = location.longitude;
      await createUser(username.value, password.value);
      await loginUserCoords(username.value, password.value, latitude, longitude);
      void updateSession();
      void router.push({ name: "Home" });
    });
  }
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="register">
    <h3>Register User</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-address">Current Location</label>
        <input type="text" v-model.trim="address" id="aligned-address" placeholder="Address (leave blank to use current location)" title="Leave blank to use GPS location."/>
      </div>
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">{{submitText}}</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}
input {
  width: 25em;
}
</style>
