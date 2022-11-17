<template>
    <div class="relative">
        <NavBar />

        <div>
            <h1 v-if="error.statusCode === 404">Page not found</h1>
            <h1 v-else>An error occurred</h1>
            <NuxtLink to="/">Home page</NuxtLink>
        </div>

        <Footer />
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['error']);

</script>
