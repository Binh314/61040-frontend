<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import router from "./router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn, currentUsername, eventMode } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());


const bgColor = ref("var(--page-bg)")

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});

function goToEventModeInfo() {
  router.push({ name: "EventModeInfo" });
}
</script>

<template>
  <!-- <div class = "row"> -->
  <section class="banner" v-if="eventMode" @click="goToEventModeInfo">
    <h3>Nakama is in Event Mode. Click for more information.</h3>
  </section>
  <br v-if="eventMode">
  <div class = "pure-grid page pageContent" :style="(eventMode) ? 'background-color: red' : ''">
    <div class="pure-u-1-6"> <!--2/12-->
      <header>
        <!-- <div class = "col"> -->
        <nav :style="(eventMode) ? 'color: black' : ''">
          <div class="title">
            <img src="@/assets/images/nika.svg" />
            <RouterLink v-if="eventMode" :to="{ name: 'EventMode' }">
              <h2>Nakama</h2>
            </RouterLink>
            <RouterLink v-else :to="{ name: 'Home' }">
              <h2>Nakama</h2>
            </RouterLink>
          </div>
            <ul>
              <div class="pages">
                <div>
                  <li v-if="!eventMode">
                    <font-awesome-icon :icon="['fas', 'house']" size="2xl" class="icon" />
                    <RouterLink :to="{ name: 'Home' }" :class="`route ${ (currentRouteName == 'Home') ? 'underline' : '' }`">Home </RouterLink>
                  </li>
                  <li v-if="eventMode">
                    <font-awesome-icon :icon="['fas', 'house']" size="2xl" class="icon" />
                    <RouterLink :to="{ name: 'EventMode' }" :class="`route ${ (currentRouteName == 'EventMode') ? 'underline' : '' }`">Home </RouterLink>
                  </li>
                  <li v-if="!eventMode">
                    <font-awesome-icon :icon="['fas', 'calendar']" size="2xl" class="icon"/>
                    <RouterLink :to="{ name: 'Events' }" :class="`route ${ (currentRouteName == 'Events') ? 'underline' : '' }`">Events </RouterLink>
                  </li>
                  <li v-if="isLoggedIn">
                    <font-awesome-icon :icon="['fas', 'envelope']" size="2xl" class="icon"/>
                    <RouterLink :to="{ name: 'Messages' }" :class="`route ${ (currentRouteName == 'Messages') ? 'underline' : '' }`">Messages </RouterLink>
                  </li>
                </div>

                <div>
                  <li v-if="isLoggedIn">
                    <font-awesome-icon :icon="['fas', 'gear']" size="2xl" class="icon"/>
                    <RouterLink :to="{ name: 'Settings' }" :class="`route ${ (currentRouteName == 'Settings') ? 'underline' : '' }`">Settings </RouterLink>
                  </li>
                  <li v-else>
                    <font-awesome-icon :icon="['fas', 'right-to-bracket']" size="2xl" class="icon" />
                    <RouterLink :to="{ name: 'Login' }" :class="`route ${ (currentRouteName == 'Login') ? 'underline' : '' }`">Login </RouterLink>
                  </li>
                  <br>
                  <li v-if="isLoggedIn">
                    <font-awesome-icon :icon="['fas', 'user']" size="2xl" class="icon"/>
                    <RouterLink :to="{ name: 'Profile', params: {username: currentUsername} }" :class="`route ${ (currentRouteName == 'Profile') ? 'underline' : '' }`">Profile </RouterLink>
                  </li>
                </div>
              </div>
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

/* https://stackoverflow.com/questions/39761120/invert-svg-image-using-css */
img { /* svg on an img tag */
  -webkit-filter: invert(1); /* safari 6.0 - 9.0 */
          filter: invert(1);
}
.pageContent {
  min-height: 100vh;
  background-color: var(--page-bg);
}

li {
  display: flex;
  align-items: center;
}

.banner {
  text-align: center;
  margin: 0;
  margin-bottom: 0;
  background-color: lightgray;
  padding:0.25em;
  position: fixed;
  width: 100%;
  z-index: 1
}
h3 {
  margin: 0;
}

.banner:hover {
  background-color: gray;
  cursor: pointer;
}

.pages {
  display:flex;
  flex-direction: column;
  justify-content: space-between;
  height: 95%;
}
.icon  {
  margin-right: 0.5em;
  width: 1em;
}

nav {
  padding: 1em 2em;
  /* background-color: rgba(211, 211, 211, 0.5); */
  background-color: var(--dark-bg);
  color: white;
  display: flex;
  align-items: center;
  overflow: hidden;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  /* z-index: 1; */
}

.route {
  font-size: 20px;
  line-height: 3em;
  color: white;
  /* -webkit-text-stroke: 1px black; */
}

h2 {
  color: white;
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
  align-items: start;
  flex-direction: column;
  line-height: 2em;
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