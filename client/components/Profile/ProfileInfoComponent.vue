<script setup lang="ts">
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import EditProfileForm from "@/components/Profile/EditProfileForm.vue";
import ProfileComponent from "@/components/Profile/ProfileComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import router from "../../router";
const { isLoggedIn, currentUsername, eventMode } = storeToRefs(useUserStore());

// const currentRoute = ref(useRoute());
// const currentRouteName = computed(() => currentRoute.value.name);

let posts = ref<Array<Record<string, string>>>([]);

const loaded = ref(false);
const componentKey = ref(1);
let profile = ref<Record<string, string>>();
let editing = ref("");
const username = ref("");

async function getPosts() {
  const author = username.value;
  let query: Record<string, string> = { author };
  let postResults;
  try {
    postResults = await fetchy("/api/posts", "GET", { query })
  } catch (_) {
    return;
  }
  posts.value = postResults;
}

    
async function getProfile() {
  let profileResult;
  try {
    profileResult = await fetchy(`/api/profile/user/${username.value}`, "GET")
  } catch (_) {
    return;
  }
  profile.value = profileResult;
  componentKey.value = componentKey.value * -1; // reload sidebar
}


function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  const user = router.currentRoute.value.params.username;
  console.log(user);
  if (typeof user === "string")
    username.value = user;
  await getProfile();
  await getPosts();
  loaded.value = true;
});


</script>

<template>
  <div class="profileInfo">
    <div class="row">
    </div>
    <section class="profile" v-if="profile">
      <article>
        <ProfileComponent v-if="editing !== profile._id" :profile="profile" @refreshProfile="getProfile"
        @editProfile="updateEditing" />
        <EditProfileForm v-else :profile="profile" @refreshProfile="getProfile" @editProfile="updateEditing" />
      </article>
    </section>
    <p v-else-if="loaded">No profile found</p>
    <p v-else>Loading...</p>
    <br>
    <h2>Posts</h2>
    <section class="posts" v-if="loaded && posts.length !== 0">
      <div v-for="post in posts" :key="post._id">
        <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
        <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      </div>
    </section>
    <p v-else-if="loaded">No posts found</p>
    <p v-else>Loading...</p>
  </div>
</template>

<style scoped>
.profileInfo {
  margin: auto 1em;
}


section {
  display: flex;
  flex-direction: column;
  gap: 1em;
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
