<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

let username = ref("");
let password = ref("");
let address = ref("");
let updatingLoc = ref(false);

const { updateUser, updateSession, turnOffEventMode, turnOnEventMode, eventMode } = useUserStore();

async function updateUsername() {
  if (!confirm("Are you sure you want to change your username?")) return;
  await updateUser({ username: username.value });
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  if (!confirm("Are you sure you want to change your password?")) return;
  await updateUser({ password: password.value });
  await updateSession();
  password.value = "";
}

async function updateLocation() {
  if (address.value) {
    await updateAddress();
  } else {
    await updateCurrentLocation();
  }
}

async function updateAddress() {
  await fetchy("/api/location/address", "PATCH", 
  {
    body: 
    {
      address: address.value
    }
  });
  void updateSession();
  updateMode();
}

async function updateCurrentLocation() {
  updatingLoc.value = true;
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const location = pos.coords;
    const latitude = location.latitude;
    const longitude = location.longitude;
    await fetchy("/api/location/coords", "PATCH", 
    {
      body: 
      {
        lat: latitude,
        lon: longitude
      }
    });
    updateMode();
  }, () => {
    useToastStore().showToast({ message: "Please allow Nakama to know your location.", style: "error" });
  });
}

async function updateMode() {
  let eventResults;
  updatingLoc.value = false;
  try {
    eventResults = await fetchy("/api/events/at", "GET");
  } catch {
    turnOffEventMode();
    // void router.push({ name: "Home" });
  }

  if (eventResults.length > 0) {
    turnOnEventMode();
    // void router.push({ name: "EventMode" });
    return;
  }
  turnOffEventMode();
  // void router.push({ name: "Home" });
}

</script>

<template>
  <h2>Update user details</h2>
  <div class="updateForms">
    <form @submit.prevent="updateLocation" class="pure-form">
      <fieldset>
        <legend>Update your current location</legend>
        <input type="text" class="locInput" placeholder="New address (leave blank to use current location)" v-model="address"/>
        &nbsp;
        <button type="submit" class="pure-button pure-button-primary">
          {{ (updatingLoc) ? "Updating..." : "Update Location" }} 
        </button>
      </fieldset>
    </form>
    <br>
    <form @submit.prevent="updateUsername" class="pure-form">
      <fieldset>
        <legend>Change your username</legend>
        <input type="text" placeholder="New username" v-model="username" required />
        &nbsp;
        <button type="submit" class="pure-button pure-button-primary">Update username</button>
      </fieldset>
    </form>
    <form @submit.prevent="updatePassword" class="pure-form">
      <fieldset>
        <legend>Change your password</legend>
        <input type="password" placeholder="New password" v-model="password" required />
        &nbsp;
        <button type="submit" class="pure-button pure-button-primary">Update password</button>
      </fieldset>
    </form>
  </div>
</template>

<style scoped>
  .locInput {
    width: 30em;
  }

  .updateForms {
    display: flex;
    flex-direction: column;
  }
</style>
