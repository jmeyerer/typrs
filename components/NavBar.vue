<template>
  <div class="bg-black">
    <div
      v-if="animateOnLoad == null || !animateOnLoad"
      class="bg-transparent border-b border-b-white h-fit min-h-[2rem] w-full flex flex-row items-center text-white font-bold z-40 inset-0 top-0"
    >
      <NuxtLink 
        to="/"
        class="font-mono text-sm px-4"
      >
        TYPRs.
      </NuxtLink>
    </div>

    <div
        v-if="animateOnLoad == true"
        class="bg-white/25 w-full h-fit min-h-[2rem] flex flex-col items-center justify-center text-white font-bold z-40 inset-0 top-0 wipe-in"
    >
      <NuxtLink
        class=""
        to="/practice"
      >
        Play now
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  animateOnLoad: {
    type: [Boolean],
  },
});


</script>

<style scoped>
@keyframes wipe-in-bottom-right {
  from {
    clip-path: polygon(0 0, 0 0, 0 0, 0 50%);
  }
  to {
    clip-path: polygon(-50% 0%, 200% 0, 0 200%, 0 -50%);
  }
}

.wipe-in {
  animation: 1.5s cubic-bezier(0.25, 1, 0.3, 1) wipe-in-bottom-right both;
}
</style>
