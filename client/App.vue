<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn, currentUsername } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <!-- <div class = "row"> -->
  <div class = "pure-grid page">
    <div class="pure-u-1-6"> <!--2/12-->
      <header>
        <!-- <div class = "col"> -->
        <nav>
          <div class="title">
            <img src="@/assets/images/logo.svg" />
            <RouterLink :to="{ name: 'Home' }">
              <h2>Nakama</h2>
            </RouterLink>
          </div>
          <ul>
            <li>
              <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'Events' }" :class="{ underline: currentRouteName == 'Events' }"> Events </RouterLink>
            </li>
            <li v-if="isLoggedIn">
              <RouterLink :to="{ name: 'Messages' }" :class="{ underline: currentRouteName == 'Messages' }"> Messages </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'Test' }" :class="{ underline: currentRouteName == 'Test' }"> Test </RouterLink>
            </li>
            <li v-if="isLoggedIn">
              <RouterLink :to="{ name: 'Profile', params: {username: currentUsername} }" :class="{ underline: currentRouteName == 'Profile' }"> Profile </RouterLink>
            </li>
            <li v-if="isLoggedIn">
              <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
            </li>
            <li v-else>
              <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
            </li>
          </ul>
        </nav>
        <!-- </div> -->
      <article v-if="toast !== null" class="toast" :class="toast.style">
        <p>{{ toast.message }}</p>
      </article>
          </header>
    </div>
    <div class="pure-u-5-6"> <!--10/12-->
        <RouterView class="content"/>
    </div>
  </div>
</template>

<style scoped>
@import "./assets/toast.css";

/* .row {
  display: flex;
}

.col {
  flex: 50%;
} */

/* .content {
  display: flex;
  align-items: end;
} */


nav {
  padding: 1em 2em;
  background-color: rgba(211, 211, 211, 0.5);
  display: flex;
  align-items: center;
  overflow: hidden;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  /* z-index: 1; */
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: end;
  flex-direction: column;
  gap: 1em;
  height: 85vh;
  /* justify-content: space-between; */
}

.underline {
  text-decoration: underline;
}

.content {
  /* z-index: 2; */
  padding: 1em;
}

</style>


<!--Sources to Make NavBar Vertical
https://www.freecodecamp.org/news/fixed-side-and-bottom-navbar-with-css-flexbox/
https://www.freecodecamp.org/news/fixed-side-and-bottom-navbar-with-css-flexbox/-->