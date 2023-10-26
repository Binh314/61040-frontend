<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SearchPostForm from "./SearchPostForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");
const creating = ref(false);

async function getPostFeed(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/feed/posts", "GET")
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  posts.value = postResults;
  creating.value = false;
}

async function getPosts(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query })
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  posts.value = postResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

function createPost() {
  creating.value = true;
}

onBeforeMount(async () => {
  if (isLoggedIn.value) {
    await getPostFeed();
  } else {
    await getPosts();
  }
  loaded.value = true;
});
</script>

<template>
  <div v-if="creating">
    <section class="postForm" v-if="isLoggedIn">
      <h2>Create a post:</h2>
      <CreatePostForm @refreshPosts="getPostFeed" />
    </section>
  </div>
  <div v-else>
    <button class="pure-button pure-button-primary" @click="createPost" v-if="isLoggedIn" >Create a Post</button>
    <div class="row">
      <h2 v-if="!searchAuthor">Posts:</h2>
      <h2 v-else>Posts by {{ searchAuthor }}:</h2>
      <SearchPostForm @getPostsByAuthor="getPosts" />
    </div>
    <section class="posts" v-if="loaded && posts.length !== 0">
      <div v-for="post in posts" :key="post._id">
        <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPostFeed" @editPost="updateEditing" />
        <EditPostForm v-else :post="post" @refreshPosts="getPostFeed" @editPost="updateEditing" />
      </div>
    </section>
    <p v-else-if="loaded">No posts found</p>
    <p v-else>Loading...</p>
  </div>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 100%;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.postForm {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 100%;
  padding: 1em;
}
</style>
