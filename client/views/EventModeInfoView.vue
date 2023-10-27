<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import router from "../router";
import { fetchy } from "../utils/fetchy";

const { turnOffEventMode } = useUserStore();
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const events = ref<Array<string>>([]);

onBeforeMount(async () => {
  let eventResults;
  try {
    eventResults = await fetchy("/api/events/at", "GET");
  } catch {
    eventResults = [];
  }
  events.value = eventResults.map((event: { title: any; }) => event.title);
});

function exitEventMode() {
  if (!confirm("Are you sure you want to exit Event Mode?")) return;
  turnOffEventMode();
  router.push({ name: "Home" })
}

</script>

<template>
  <div class="pure-grid">
    <div class="pure-u-2-3">
      <main class="main">
        <h1>About Event Mode</h1>
        <p>While you are attending an event, <b>Nakama</b> will enter <b>Event Mode</b>, becoming a <b>tool for socialization</b>. </p>
        <p><b>Event Mode</b> restricts <b>Nakama</b> to show <b>profiles and posts</b> from <b>other attendees</b>.</p>
        <p><b>Event Mode</b> helps you <b>find people</b> with <b>similar interests</b> and <b>make new friends</b>.</p>
        <br>
        <p>You are currently attending <b>{{ events.join(', ') }} </b>.</p>
        <p v-if="events.length === 1"> If you are <b>NOT attending</b> this event, please <b>press the button</b> below to <b>exit Event Mode</b>.</p>
        <p v-else> If you are <b>NOT attending</b> any of these events, please click the button below to exit <b>Event Mode</b>.</p>
        <div class="button"><button class="pure-button button-error" @click="exitEventMode">Exit Event Mode</button></div>
      </main>
    </div>
  </div>
</template>

<style scoped>

/* .main {
  display: flex;
  flex-direction: column;
} */

.button {
  display: flex;
  justify-content: center;
}

h1, h2 {
  text-align: center;
}

p {
  line-height: 2em;
}
</style>
