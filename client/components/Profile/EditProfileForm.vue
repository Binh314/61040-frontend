<script setup lang="ts">
import TagsInput from "@/components/Global/TagsInput.vue";
import { formatBdaypick, toDateString } from "@/utils/formatDate";
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["profile"]);
const emit = defineEmits(["refreshProfile", "editProfile"]);


const name = ref(props.profile.name);
const photo = ref(props.profile.photo);
const location = ref(props.profile.location);
const bio = ref(props.profile.bio);
const birthdate = ref(formatBdaypick(props.profile.birthdate));
const interests = ref<Array<string>>(props.profile.interests);


const bdayPick = ref(null);

const interestString = ref("interest")


function updateInterests(tags: string[]) {
//   topics.value.length = 0; // clear array
//   topics.value.push(...tags);
}

onMounted(() => {

});



const editProfile = async(name: string, bio: string, location: string, bday: string, interests: string[], photo: string) => {
  console.log('triggered');
  try {
    const birthdate = toDateString(bday);
    // if (new Date(startTime) > new Date(endTime)) throw new Error("The end time needs to be later than the start time.");
    await fetchy(`/api/profile/edit`, "PATCH", 
      { body: { update: 
        { name: name,
          bio: bio,
          location: location,
          interests: interests,
          photo: photo
        },
        birthdate: birthdate
      } 
    });
  } catch (e) {
    return;
  }
  emit("editProfile");
  emit("refreshProfile");
}
</script>


<template>
  <form @submit.prevent="editProfile(name, bio, location, birthdate, interests, photo)">
    <label for="photo">Photo</label>
    <input id="photo" v-model="photo" placeholder="url of your profile photo" @keypress.enter.prevent> 

    <label for="name">Name</label>
    <input id="name" v-model="name" placeholder="your name" required @keypress.enter.prevent> 

    <label for="location">Location</label>
    <input id="location" v-model="location" placeholder="your location" @keypress.enter.prevent>

    <label for="birthdate">Birthday</label>
    <input ref="bdayPick" type="date" v-model="birthdate" id="birthdate" name="birthday" @keypress.enter.prevent/>

    <label for="interestsInput">Interests</label>
    <TagsInput id="interestsInput" :initTags="interests" @updateTags="updateInterests" :tagName="interestString"/>

    <label for="bio">Bio</label>
    <textarea id="bio" v-model="bio" placeholder="your bio"> </textarea>

    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editProfile')">Cancel</button></li>
      </menu>
    </div>
    </form>
</template>

<style scoped>
label {
  padding-top: 1em;
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
