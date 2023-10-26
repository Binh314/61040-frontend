<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import ProfileHeaderComponent from "../Profile/ProfileHeaderComponent.vue";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername, eventMode } = storeToRefs(useUserStore());

async function goToMessages(author: string) {
  if (!eventMode.value) return;
  void router.push({ name: "Messages", params: {username: author} });
}


const deletePost = async () => {
  if (!confirm("Are you sure you want to delete this post?")) return;
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};
</script>

<template>
  <article :class="(eventMode) ? 'eventModeContainer' : 'container'" @click="goToMessages(props.post.author)" >
    <p class="author"> <ProfileHeaderComponent :username="props.post.author"/> </p>
    <p>{{ props.post.content }}</p>
    <p class="files">
      <img v-for="file in props.post.files" class="postImage" :src="file">
    </p>
    <div class="base">
      <menu v-if="props.post.author == currentUsername && !eventMode">
        <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
        <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
      </menu>
      <article class="timestamp" v-if="!eventMode">
        <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
      </article>
    </div>
  </article>
</template>

<style scoped>

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.eventModeContainer:hover {
  cursor: pointer;
  background-color: lightgray;
}

p {
  margin: 0em;
  white-space: pre
}

.author {
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}

.postImage {
  object-fit:scale-down;
  max-width: 100%;
  max-height: 50vh;
  display: inline-block;
  padding: 0.5em;
  border-radius: 1em;
}


.files {
  display: flex;
  flex-wrap: wrap;
}

</style>
