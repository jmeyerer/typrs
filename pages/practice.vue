<template>
    <div class="w-full h-full min-h-screen flex flex-col items-center justify-center bg-black transition-all duration-500 ease-in-out">
        <div v-if="sentence == null" class="h-full w-full"></div>
        <span 
            class="w-fit max-w-[36rem] text-lg text-white pb-16 flex flex-row flex-wrap break-words"
        >
            <span 
                class="w-fit text-white/75 inline-block px-0.5 relative z-0"
                v-for="(word, index) in correctPartOfSentence"
                :key="index"
            >
                {{ word }}
                <span 
                    class="absolute w-full h-full top-0 left-0 -z-10"
                    :class="{
                        'bg-gray-700/50 highlighted-word' : lastWordCorrect == false,
                        'bg-yellow-400/50' : lastWordCorrect == true
                    }"
                ></span>
            </span>
            <span 
                class="text-white inline-block px-0.5"
            >
                <span
                    :class="{
                        'bg-green-700/80' : wordSpelledCorrectly,
                        'bg-red-500/80' : !wordSpelledCorrectly
                    }"
                >{{ currentWordBeingTyped }}</span>
                <span>{{ currentWordBeingEdited }}</span>
            </span>
            <span 
                class="inline-block" 
                v-for="(word, index) in restOfWordsArray"
                :key="index"
            >
                <span class="inline-block px-0.5" v-if="restOfWordsArray.includes(word)">
                    {{ word }}
                </span>
            </span>
        </span>
        <Transition mode="out-in" :duration="250">
            <input
                class="w-[36rem] h-fit rounded-md bg-white/25 text-white break-normal"
                type="text"
                v-model="textArea"
                v-if="!lastWordCorrect"
            />
            <button
                v-else
                class="rounded-lg px-5 py-1 font-semibold text-white bg-slate-700 hover:contrast-125 active:scale-90 transition-all duration-150 ease-in-out"
                @click="reload()"
            >
                Restart    
            </button>
        </Transition>


        <Transition mode="out-in" :duration="250">
            <div class="mt-32" v-if="averageBetweenKeystrokes != 0 && averageWPM != ''">
                <p class="text-white text-xl font-semibold">Your average time between keystrokes was: {{ averageBetweenKeystrokes }}ms</p>
                <p class="text-white text-xl font-semibold">Your WPM was: {{ averageWPM }} wpm</p>
            </div>
        </Transition>
    </div>   
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'

definePageMeta({
    layout: 'default-nav-on-top'
});
const response = axios.get('https://ai2kseih7k.execute-api.us-east-1.amazonaws.com/default/typrs-sentence');
const responseObj = await response;

// NOTE For some reason, response can't be consumed until after it gets back for some reason? can't do response.data.sentence_line for whatever reason
const sentence = responseObj.data.sentence_line;

const textArea = ref('');
const restOfSentence = ref(sentence);
const correctPartOfSentence = ref(['']);
const incorrectPartOfWord = ref('');
const wordSpelledCorrectly = ref(true);
const firstWordCorrect = ref(false);
const lastWordCorrect = ref(false);
const currentWordCorrect = ref(true);

const wordsArray = ref(sentence.split(" "));
const currentWordBeingTyped = ref('');
const currentWordBeingEdited = ref(wordsArray.value[0]);
const restOfWordsArray = ref(wordsArray.value.slice(1));
let currentWordIndex = 0;
let currentWord = wordsArray.value[0];


let keyStrokeList = [];
let lastKeyStroke;
const averageBetweenKeystrokes = ref(0);
const averageWPM = ref('');

// Get rid of the first value in the array initially so that it's empty 
correctPartOfSentence.value.pop(); // TODO (might not have to do this without typescript anymore? can't remember if I had to make a list with an element in it because of that)


onMounted(() => {
    window.addEventListener('keydown', (e) => {
        if(e.key == 'Enter') 
        {
            if(textArea.value == currentWord) {
                if(wordsArray.value[currentWordIndex+1] == null)
                {
                    correctPartOfSentence.value.push(currentWordBeingTyped.value);
                    currentWordBeingTyped.value = '';
                    textArea.value = '';
                    lastWordCorrect.value = true;
                    return;
                }
                firstWordCorrect.value = true;
                currentWordIndex += 1;
                currentWord = wordsArray.value[currentWordIndex];
                
                currentWordBeingEdited.value = restOfWordsArray.value[0];
                restOfWordsArray.value = restOfWordsArray.value.slice(1);

                correctPartOfSentence.value.push(currentWordBeingTyped.value);

                currentWordBeingTyped.value = '';
                textArea.value = '';
                return;
            }
        }
    })
});

watch(textArea, async (newValue, oldValue) => {
    // If the user deletes a character (and it isn't us setting the value of the text area back to empty)
    if(newValue.length < oldValue.length && !(newValue == '' && oldValue.charAt(oldValue.length-1) == ' '))
    {
        // restOfSentence.value = currentWord[currentWordIndex].substring(restOfSentence.value.length-1,);
        currentWordBeingEdited.value = currentWord.charAt(currentWordBeingTyped.value.length-1) + currentWordBeingEdited.value; // get last character typed, add it to beginning of word being edited

        currentWordCorrect.value = isCurrentWordCorrect(newValue);
        wordSpelledCorrectly.value = currentWordCorrect.value;
        currentWordBeingTyped.value = newValue;

        return;
    }
    // If the new input's last character is a space and the word so far is equal to the current word [i.e. successful word case]
    if(newValue.charAt(newValue.length-1) == ' ' && (currentWordBeingTyped.value == currentWord))
    {
        if(wordsArray.value[currentWordIndex+1] == null)
        {
            correctPartOfSentence.value.push(currentWordBeingTyped.value);
            currentWordBeingTyped.value = '';
            textArea.value = '';
            lastWordCorrect.value = true;
            return;
        }
        firstWordCorrect.value = true;
        currentWordIndex += 1;
        currentWord = wordsArray.value[currentWordIndex];
        
        currentWordBeingEdited.value = restOfWordsArray.value[0];
        restOfWordsArray.value = restOfWordsArray.value.slice(1);

        correctPartOfSentence.value.push(currentWordBeingTyped.value);

        currentWordBeingTyped.value = '';
        textArea.value = '';
        return;
    }
    // If the new input is longer than the old input, and the new input is equal to the current word up to the current letters typed
    if(newValue.length > oldValue.length && newValue === currentWord.substring(0, newValue.length))
    {
        // Add new keystrokes to array
        addKeyStroke(newValue, oldValue);

        currentWordCorrect.value = true;
        currentWordBeingTyped.value = newValue;
        currentWordBeingEdited.value = currentWordBeingEdited.value.substring(1,)

        wordSpelledCorrectly.value = true;
        return;
    }
    // If the new input is incorrect compared to the current word
    else if (newValue != currentWord.substring(0, newValue.length)) {
        wordSpelledCorrectly.value = false;
        currentWordCorrect.value = false;
        currentWordBeingTyped.value = newValue;
        currentWordBeingEdited.value = currentWordBeingEdited.value.substring(1,)

    }
});

function isCurrentWordCorrect(input) {
    return input == currentWord.substring(0, input.length);
}

function addKeyStroke(newValue, oldValue) {
    let newKeyStroke = Date.now();
    if(newValue.length > oldValue.length) {
        keyStrokeList.push(
            {
                key: newValue.charAt(newValue.length-1),
                time: newKeyStroke
            }
        )
    }
}

function reload() {
    location.reload();
}


watch(lastWordCorrect, async (newValue, oldValue) => {
    if (newValue == true && oldValue == false)
    {
        let average = 0;
        for(let i = 1; i < keyStrokeList.length; i++) {
            average += keyStrokeList[i].time - keyStrokeList[i-1].time;
        }
        
        averageBetweenKeystrokes.value = Math.round((average / (keyStrokeList.length - 1))* 1e2 ) / 1e2;
        let totalWords = Math.round(keyStrokeList.length / 5);
        let totalTimeElapsed = ((keyStrokeList[keyStrokeList.length-1].time - keyStrokeList[0].time)/1000)/60; // Get time in minutes
        averageWPM.value = (totalWords / totalTimeElapsed).toFixed(0);
    }    
});

</script>


<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}


@keyframes wipe-in-right {
    from {
      clip-path: inset(0 100% 0 0);
    }
    to {
      clip-path: inset(0 0 0 0);
    }
  }
  
.highlighted-word {
    animation: 0.25s ease wipe-in-right both;
}
</style>