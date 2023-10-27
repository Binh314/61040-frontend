<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import TagsInput from "../Global/TagsInput.vue";

const content = ref("");
const files = ref<Array<string>>([]);
const emit = defineEmits(["refreshPosts"]);

const createPost = async (content: string, f: string[]) => {
  const files = f.filter(e=>e);
  try {
    await fetchy("/api/posts", "POST", {
      body: { content, files },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

function updatePhotos() {

}

const emptyForm = () => {
  content.value = "";
  files.value = [];
};
</script>

<template>
  <article>
    <form @submit.prevent="createPost(content, files)">
      <label for="content">Post Contents:</label>
      <textarea id="content" v-model="content" placeholder="Create a post!" required> </textarea>
      <label for="photos"> Attach Photos: </label>
      <TagsInput class="photos" :initTags="files" tagName="photo url" @updateTags="updatePhotos" />
      <div class="files">
        <img v-for="file in files" class="postImage" :src="file">
      </div>
      <menu>
      <li><button type="submit" class="pure-button-primary pure-button">Create Post</button></li>
      <li><button class="btn-small pure-button" @click.prevent="emit('refreshPosts')">Cancel</button></li>
    </menu>
    </form>
  </article>
</template>

<style scoped>

article {
  border-style: dashed;
}

.postImage {
  object-fit: scale-down;
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
label {
  margin-top: 1em;
}
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
