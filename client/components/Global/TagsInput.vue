<script setup lang="ts"  crossorigin="anonymous"> 
// src="https://kit.fontawesome.com/40828c6ea5.js"
import { ref } from "vue";

const emit = defineEmits(["updateTags"]);
const props = defineProps(["initTags"]);

const tags = ref<Array<string>>(props.initTags);

function inputWidth(i: number) {
  return Math.max(tags.value[i].length, 8) * 5/8 + "em"; 
}


function addTag() {
  tags.value.push('');
  console.log(tags.value);
  emit("updateTags", tags.value);
}

function removeTag(i: number) {
  tags.value.splice(i, 1);
  console.log(tags.value);
  emit("updateTags", tags.value);
}


// onBeforeMount(() => {
//   console.log(props.initTags);
//   tags.value.push(...props.initTags);
// });

</script>


<template>
  <div>
    <span v-for="(tag, index) in tags">
      <input v-model="tags[index]" class = "tagInput" @blur="emit('updateTags', tags)"  placeholder = "enter tag"
      :style="{ width: inputWidth(index) }" autofocus @keypress.enter.prevent> 
      <font-awesome-icon :ref="`input${index}`" :icon="['fas', 'square-xmark']" size="xl" @click="removeTag(index)" class="removeIcon"/>
    </span>
    <font-awesome-icon :icon="['far', 'square-plus']" size="xl" @click="addTag" class="addIcon"/>
  </div>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}


.removeIcon {
  gap: 0px;
}

.tagInput {
  gap: 0px;
  background-color: lightgrey;
  font-weight: bold;
  text-align: center
}

.tagInput:focus {
  gap: 0px;
  background-color: white;
  font-weight: normal;
}

</style>
