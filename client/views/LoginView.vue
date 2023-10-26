<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
</script>

<template>
  <div class="pure-grid">
    <div class="pure-u-2-3">
      <main class="column">
        <h1>Please login or register!</h1>
        <LoginForm />
        <RegisterForm />
      </main>
    </div>
  </div>
</template>

<!-- <style scoped>
  h1 {
    text-align: center;
  }
</style> -->
