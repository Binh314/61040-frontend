<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, watch } from "vue";
// import router from "../../router";
import router from "../../router";
import MessageComponent from "./MessageComponent.vue";
import MessageListComponent from "./MessageListComponent.vue";

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

// const currentRoute = ref(useRoute());
// const currentRouteName = computed(() => currentRoute.value.name);

let messages = ref<Array<Record<string, string>>>([]);

const loaded = ref(false);
const componentKey = ref(1);
let profile = ref<Record<string, string>>();
let editing = ref("");
const username = ref("");

const messaging = ref<Array<string>>();

// setInterval(getMessages, 1000);

async function getMessages() {
  let messageResults;
  try {
    messageResults = await fetchy("/api/message/all", "GET")
  } catch (_) {
    return;
  }
  messages.value = messageResults;
  const usernames = messages.value.map(message => 
    (message.from === currentUsername.value) ? message.to : message.from
  );
  messaging.value = [...new Set(usernames)];
}

  
watch(async () => router.currentRoute.value.params.username, 
  async name => { 
    const user = await name;
    if (typeof user === "string") 
      username.value = user;
    console.log(username.value)
    await getMessages();
  }
);

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  const user = router.currentRoute.value.params.username;
  if (typeof user === "string")
    username.value = user;
  await getMessages();
  loaded.value = true;
});


</script>

<template>
  <div class="pure-grid">
    <div class="pure-u-1-4">
      <h1>Messages</h1>
      <button>New Message</button>
      <MessageListComponent :messaging="messaging"/>
    </div>
    <div class="pure-u-1-2">
      <MessageComponent v-if="username" :username="username"/>
    </div>
    <div class="pure-u-1-4">
    </div>
  </div>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

button {
  margin-bottom: 2em;
}

section,
p,
.row {
  margin: 0 auto;
  /* max-width: 60em; */
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.profiles {
  padding: 1em;
}

.formArea {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 1em
}
</style>
