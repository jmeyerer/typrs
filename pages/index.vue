<template>
  <div
    class="w-full h-full min-h-screen flex flex-col items-center justify-center bg-black transition-all duration-500 ease-in-out"
  >
    <!-- NOTE Main Splash Page -->
    <div class="font-cultivemono text-white text-9xl flex flex-row pb-32" id="title">
      <span
        v-for="(letter, index) in typrsText"
        :ref="index"
        class="tracking-widest"
      >
        {{ letter }}
      </span>
      <span
        class="w-min h-min font-thin scale-125 font-sans -translate-y-4 -translate-x-8 pl-3"
        :class="{
          'blinking-line': doneTyping,
        }"
      >
        |
      </span>
    </div>
    <div
      class="flex flex-row items-center space-x-16 w-fit transition-all duration-500 ease-in-out opacity-0"
      id="gamemode-buttons-container"
    >
      <NuxtLink
        to="/practice/"
        class="rounded-lg font-semibold text-base text-white px-5 py-1.5 hover:bg-white hover:text-black duration-250 transition-all ease-in-out active:scale-90"
      >
        <span class="flex flex-row items-center space-x-2">
          <span> Play Solo </span>
          <font-awesome-icon icon="fa-solid fa-keyboard" class="text-lg" />
        </span>
      </NuxtLink>
      <button
        disabled
        class="border border-white/50 rounded-lg font-semibold text-base text-white px-5 py-1.5 tooltip hover:bg-white hover:text-black duration-250 transition-all ease-in-out disabled:hover:cursor-default disabled:hover:bg-black/50 disabled:hover:text-white/50 disabled:bg-black/50 disabled:text-white/50"
      >
        Coming soon!
        <span class="tooltiptext"
          >More gamemodes and functionality are currently being worked on - come
          back later to try them out!</span
        >
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

definePageMeta({
  layout: "just-body",
});

const typrsText = ref("");
let typrsString = "TYPRs.";

const doneTyping = ref(false);

onMounted(() => {
  for (let i = 1; i <= typrsString.length; i++) {
    setTimeout(() => {
      typrsText.value += typrsString.charAt(i - 1);
    }, (Math.random() * (500 - 250) + 250) * i);
  }
});

watch(typrsText, async (newValue) => {
  if (typrsText.value == typrsString) {
    doneTyping.value = true;
    // Fade in buttons after one second
    setTimeout(() => {
      document
        .getElementById("gamemode-buttons-container")
        .classList.remove("opacity-0");
    }, 1000);
  }
  // Spelled incorrectly case!
  if(typrsText.value != typrsString && typrsText.value.length == typrsString.length) {
    for(let i = typrsString.length; typrsText.value != typrsString.substring(0, typrsText.value.length); i--) {
      await sleep(200);
      typrsText.value = typrsText.value.slice(0, i);
    }
    await sleep(250);
    for(let i = typrsText.value.length; i < typrsString.length; i++)
    {
      await sleep(300);
      typrsText.value += typrsString.charAt(i);
    }
  }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
</script>

<style scoped>
@keyframes wipe-in-right {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

.animate-on-enter {
  animation: 0.25s ease wipe-in-right both;
}

.blinking-line {
  animation: animate 1s linear infinite;
}

@keyframes animate {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  width: 16rem;
  background-color: white;
  color: black;
  text-align: center;
  filter: contrast(1);
  padding: 8px;
  border-radius: 6px;
  font-size: 1rem;
  bottom: 125%;
  left: 50%;
  margin-left: -8rem;
  opacity: 0;

  position: absolute;
  z-index: 1;

  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.tooltip .tooltiptext::after {
  content: " ";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  opacity: 1;
}
</style>
