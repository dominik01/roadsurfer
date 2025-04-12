<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-primary text-primary-content p-4 shadow-md">
      <div class="container mx-auto">
        <h1 class="text-2xl font-bold">Bike Rental App</h1>
      </div>
    </header>
    <main class="container mx-auto p-4">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
