<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const emit = defineEmits(["refreshPosts"]);

const createPost = async (content: string) => {
  try {
    await fetchy("/api/posts", "POST", {
      body: { content },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(content)">
    <label for="content">Post Contents:</label>
    <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
    <menu>
    <li><button type="submit" class="pure-button-primary pure-button" @click="createPost(content)">Create Post</button></li>
    <li><button class="btn-small pure-button" @click.prevent="emit('refreshPosts')">Cancel</button></li>
  </menu>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}
menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
  padding: 0;
  margin: 0;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
}
</style>
