<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";
import TagsInput from "../Global/TagsInput.vue";

const props = defineProps(["post"]);
const content = ref(props.post.content);
const files = ref<Array<string>>(props.post.files)
const emit = defineEmits(["editPost", "refreshPosts"]);

const editPost = async (content: string, files: string[]) => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "PATCH", { body: { update: { content: content, files: files } } });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
};
function updatePhotos() {

}

</script>

<template>
  <article>
    <form @submit.prevent="editPost(content, files)">
      <p class="author">{{ props.post.author }}</p>
      <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
      <label for="photos"> Attach Photos: </label>
      <TagsInput class="photos" :initTags="files" tagName="photo url" @updateTags="updatePhotos" />
      <div class="files">
        <img v-for="file in files" class="postImage" :src="file">
      </div>
      <div class="base">
        <menu>
          <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
          <li><button class="btn-small pure-button" @click.prevent="emit('editPost')">Cancel</button></li>
        </menu>
        <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
        <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p>
      </div>
    </form>
  </article>
</template>

<style scoped>
article {
  border-style: dashed;
}

.files {
  display: flex;
  flex-wrap: wrap;
}

form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
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

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
