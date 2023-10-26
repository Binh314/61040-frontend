<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

async function getPostFeed(author?: string) {
  let postResults;
  try {
    postResults = await fetchy("/api/feed/eventmode/posts", "GET")
  } catch (_) {
    return;
  }
  posts.value = postResults;
}


// async function getPosts(author?: string) {
//   let query: Record<string, string> = author !== undefined ? { author } : {};
//   let postResults;
//   try {
//     postResults = await fetchy("/api/posts", "GET", { query })
//   } catch (_) {
//     return;
//   }
//   searchAuthor.value = author ? author : "";
//   posts.value = postResults;
// }


onBeforeMount(async () => {
  if (isLoggedIn) {
    await getPostFeed();
  } else {
    posts.value = [];
  }
  loaded.value = true;
});
</script>

<template>
  <section class="posts" v-if="loaded && posts.length !== 0">
    <div v-for="post in posts" :key="post._id">
      <PostComponent :post="post" @refreshPosts="getPostFeed"/>
    </div>
  </section>
  <p v-else-if="loaded">No posts found</p>
  <p v-else>Loading...</p>
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
