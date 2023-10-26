<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import { useToastStore } from "../../stores/toast";


const username = ref("");
const password = ref("");
const address = ref("");
const submitText = ref("Submit");
const { loginUser, updateSession, loginUserCoords, turnOnEventMode, turnOffEventMode } = useUserStore();

async function login() {
  submitText.value = "Logging in..."
  if (address.value) {
    await loginAddress();
  } else {
    await loginLocation();
  }
}

async function loginAddress() {
  await loginUser(username.value, password.value, address.value);
  void updateSession();
  route();
}

async function loginLocation() {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const location = pos.coords;
    const latitude = location.latitude;
    const longitude = location.longitude;
    await loginUserCoords(username.value, password.value, latitude, longitude);
    void updateSession();
    route();
  }, () => {
    useToastStore().showToast({ message: "Please allow Nakama to know your location.", style: "error" });
  });
}

async function route() {
  let eventResults;
  try {
    eventResults = await fetchy("/api/events/at", "GET");
  } catch {
    turnOffEventMode();
    void router.push({ name: "Home" });
  }

  if (eventResults.length > 0) {
    turnOnEventMode();
    void router.push({ name: "EventMode" });
    return;
  }
  turnOffEventMode();
  void router.push({ name: "Home" });
}

</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="login">
    <h3>Login</h3>
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
        <input type="address" v-model.trim="address" id="aligned-address" placeholder="Address (leave blank to use current location)" title="Leave blank to use GPS location." autocomplete="off"/>
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
</style>
