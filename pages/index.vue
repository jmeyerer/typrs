<template>
    <div class="w-full h-full min-h-screen flex flex-col items-center justify-center bg-black transition-all duration-500 ease-in-out">
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
                class="rounded-lg text-white inline-block px-0.5"
            >
                <span
                    :class="{
                        'bg-green-700' : wordSpelledCorrectly,
                        'bg-red-500' : !wordSpelledCorrectly
                    }"
                >{{ currentWordBeingTyped }}</span>
                <span>{{ currentWordBeingEdited }}</span>
                <!-- {{ currentWordCorrect == true ? currentPartOfWord : incorrectPartOfWord }} -->
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

definePageMeta({
    layout: 'just-body'
});

const textArr = [
    "This biographical article related to French artistic gymnastics is a stub. You can help Wikipedia by expanding it.",
    "InsideAR was the largest Augmented Reality event in Europe. It was organized and supported by metaio GmbH every year. The first event was held in 2010, had since expanded globally and was run at multiple locations around the world.  However, after Apple purchased metaio in May 2015, metaio cancelled the InsideAR conference 2015 without any statements about the conference's future.",
    "The Fearing Mind is an American horror television series that aired on the Fox Family Channel from October 21 until December 2, 2000.",
    "Bill Fearing, a famous writer of suspense thrillers, gets his ideas from things that happen in his family. When he gets an idea, the viewers enter his mind and see the gruesome events unfold.",
    "It had a bronze barrel and lacked a modern recoil system, using only an ineffective spring-mounted spade brake, and was virtually obsolescent on its introduction. Nonetheless, it was the standard field howitzer for the Austrian Army at the outbreak of the war.",
    "Lithuanian Paralympic Committee (Lithuanian: Lietuvos parolimpinis komitetas) was founded on 1990 and recognized by the International Paralympic Committee after one year.",
    "A GUI may be designed for the requirements of a vertical market as application-specific graphical user interfaces. Examples include automated teller machines (ATM), point of sale (POS) touchscreens at restaurants, self-service checkouts used in a retail store, airline self-ticket and check-in, information kiosks in a public space, like a train station or a museum, and monitors or control screens in an embedded industrial application which employ a real-time operating system (RTOS).",
    "Cell phones and handheld game systems also employ application specific touchscreen GUIs. Newer automobiles use GUIs in their navigation systems and multimedia centers, or navigation multimedia center combinations.",
    "A GUI uses a combination of technologies and devices to provide a platform that users can interact with, for the tasks of gathering and producing information.",
    "A series of elements conforming a visual language have evolved to represent information stored in computers. This makes it easier for people with few computer skills to work with and use computer software. The most common combination of such elements in GUIs is the windows, icons, menus, pointer (WIMP) paradigm, especially in personal computers.",
    "In personal computers, all these elements are modeled through a desktop metaphor to produce a simulation called a desktop environment in which the display represents a desktop, on which documents and folders of documents can be placed. Window managers and other software combine to simulate the desktop environment with varying degrees of realism.",
    "Entries may appear in a list to make space for text and details, or in a grid for compactness and larger icons with little space underneath for text. Variations inbetween exist, such as a list with multiple columns of items and a grid of items with rows of text extending sideways from the icon.",
    "Multi-row and multi-column layouts commonly found on the web are 'shelf' and 'waterfall'. The former is found on image search engines, where images appear with a fixed height but variable length, and is typically implemented with the CSS property and parameter display: inline-block;. A waterfall layout found on Imgur and Tweetdeck with fixed width but variable height per item is usually implemented by specifying column-width:.",
    "Smaller app mobile devices such as personal digital assistants (PDAs) and smartphones typically use the WIMP elements with different unifying metaphors, due to constraints in space and available input devices. Applications for which WIMP is not well suited may use newer interaction techniques, collectively termed post-WIMP user interfaces.",
    "As of 2011, some touchscreen-based operating systems such as Apple's iOS (iPhone) and Android use the class of GUIs named post-WIMP. These support styles of interaction using more than one finger in contact with a display, which allows actions such as pinching and rotating, which are unsupported by one pointer and mouse.",
    "Human interface devices, for the efficient interaction with a GUI include a computer keyboard, especially used together with keyboard shortcuts, pointing devices for the cursor (or rather pointer) control: mouse, pointing stick, touchpad, trackball, joystick, virtual keyboards, and head-up displays (translucent information devices at the eye level).",
    "There are also actions performed by programs that affect the GUI. For example, there are components like inotify or D-Bus to facilitate communication between computer programs.",
    "GUIs were a hot topic in the early 1980s. The Apple Lisa was released in 1983, and various windowing systems existed for DOS operating systems (including PC GEM and PC/GEOS). Individual applications for many platforms presented their own GUI variants. Despite the GUIs advantages, many reviewers questioned the value of the entire concept, citing hardware limits, and problems in finding compatible software.",
    "In 1984, Apple released a television commercial which introduced the Apple Macintosh during the telecast of Super Bowl XVIII by CBS, with allusions to George Orwell's noted novel Nineteen Eighty-Four. The goal of the commercial was to make people think about computers, identifying the user-friendly interface as a personal computer which departed from prior business-oriented systems, and becoming a signature representation of Apple products.",
    "Windows 95, accompanied by an extensive marketing campaign, was a major success in the marketplace at launch and shortly became the most popular desktop operating system.",
    "In 2007, with the iPhone and later in 2010 with the introduction of the iPad,  Apple popularized the post-WIMP style of interaction for multi-touch screens, and those devices were considered to be milestones in the development of mobile devices.",
    "The GUIs familiar to most people as of the mid-late 2010s are Microsoft Windows, macOS, and the X Window System interfaces for desktop and laptop computers, and Android, Apple's iOS, Symbian, BlackBerry OS, Windows Phone/Windows 10 Mobile, Tizen, WebOS, and Firefox OS for handheld (smartphone) devices.[citation needed]",
    "GUIs can be made quite hard when dialogs are buried deep in a system or moved about to different places during redesigns. Also, icons and dialog boxes are usually harder for users to script.",
    "WIMPs extensively use modes, as the meaning of all keys and clicks on specific positions on the screen are redefined all the time. Command-line interfaces use modes only in limited forms, such as for current directory and environment variables.",
    "Most modern operating systems provide both a GUI and some level of a CLI, although the GUIs usually receive more attention. The GUI is usually WIMP-based, although occasionally other metaphors surface, such as those used in Microsoft Bob, 3dwm, or File System Visualizer.",
    "Several attempts have been made to create a multi-user three-dimensional environment or 3D GUI, including Sun's Project Looking Glass, Metisse, which was similar to Project Looking Glass, BumpTop, where users can manipulate documents and windows with realistic movement and physics as if they were physical documents, and the Croquet Project, which moved to the Open Cobalt and Open Croquet efforts.",
    "The zooming user interface (ZUI) is a related technology that promises to deliver the representation benefits of 3D environments without their usability drawbacks of orientation problems and hidden objects. It is a logical advance on the GUI, blending some three-dimensional movement with two-dimensional or 2.5D vector objects. In 2006, Hillcrest Labs introduced the first zooming user interface for television.",
    "Some environments use the methods of 3D graphics to project virtual three-dimensional user interface objects onto the screen. These are often shown in use in science fiction films (see below for examples). As the processing power of computer graphics hardware increases, this becomes less of an obstacle to a smooth user experience.",
    "Three-dimensional graphics are currently mostly used in computer games, art, and computer-aided design (CAD). A three-dimensional computing environment can also be useful in other uses, like molecular graphics, aircraft design and Phase Equilibrium Calculations/Design of unit operations and chemical processes.",
    "Interfaces for the X Window System have also implemented advanced three-dimensional user interfaces through compositing window managers such as Beryl, Compiz and KWin using the AIGLX or XGL architectures, allowing the use of OpenGL to animate user interactions with the desktop.",
    "Giuliani received her first call-up for the senior team as Italy faced Austria in a friendly held on 7 April 2013. She was left out of the squad which took part in the UEFA Women's Euro 2013. She made her debut on 5 April 2014 against Spain in a 2015 FIFA Women's World Cup qualification match.",
    "Fishing industry in North Korea provides an important supplement to the diet and for export. The catch in 2001 totaled 200,000 tons of wild-caught seafood and 63,700 tons produced using aquaculture. The major fishing grounds are in the coastal areas of the Sea of Japan to the east and the Yellow Sea to the west. The main fishery ports are Sinpo, Kimchaek, and the nearby deep-sea fishery bases of Yanghwa and Hongwfin. The principal catch from the Sea of Japan is pollock.",
    "North Korea's coastline of about 2,495 kilometers, mixture of warm and cold ocean currents, and many rivers, lakes, and streams make its potential for fishery development better than for most other countries.",
    "The major fishing grounds are in the coastal areas of the Sea of Japan to the east and the Yellow Sea to the west. The principal catch from the Sea of Japan is pollock. Sardine and squid catches are also significant. From the west coast, yellow corvina and hairtail are the most common varieties of fish. Deep-sea catches include herring, mackerel, pike, and yellowtail. Shellfish and mollusks are caught too.",
    "A major expansion of technical schools was undertaken since the 1950s, with specialized courses including fishing. Not until the early 1960s, however, did the domestic fishing industry begin to expand rapidly, receiving increased investment in vessels, equipment, and port facilities. Deep-sea fishing began in earnest in the 1970s.",
    "Total marine products increased from 465,000 tons in 1960 to 1.14 million tons in 1970, registering an annual growth rate of 9.4 percent compared with the planned rate of 14.5 percent. The Six-Year Plan target of 1 .6 million tons was met in 1976.",
    "The catch in 2001 totaled 200,000 tons of wild-caught freshwater and saltwater fish, shellfish, and mollusks and about 63,700 tons produced using aquaculture. The exact numbers of present catches are unknown. Unlike most countries, North Korea does not report its annual catch to the Food and Agriculture Organization (FAO), of which it is a member.",
    "Fish is an important export commodity to North Korea. Fish and seafood are particularly exported to China. The United Nations Security Council sanctions from 2017 banned North Korean exports of seafood. Prior to the ban, North Korean exports of seafood were estimated at US$300 million annually.",
    "According to a 1988 agreement with the United Nations Development Programme, North Korea was to receive assistance in construction of a fish farm."
];

const textArea = ref('');
const someSentence = ref(textArr[Math.floor(Math.random() * textArr.length)]);
const restOfSentence = ref(someSentence.value);
const correctPartOfSentence = ref(['']);
const incorrectPartOfWord = ref('');
const wordSpelledCorrectly = ref(true);
const firstWordCorrect = ref(false);
const lastWordCorrect = ref(false);
const currentWordCorrect = ref(true);

const wordsArray = ref(someSentence.value.split(" "));
const currentWordBeingTyped = ref('');
const currentWordBeingEdited = ref(wordsArray.value[0]);
const restOfWordsArray = ref(wordsArray.value.slice(1));
let currentWordIndex = 0;
let currentWord = wordsArray.value[0];


let keyStrokeList = [];
let lastKeyStroke;
const averageBetweenKeystrokes = ref(0);
const averageWPM = ref('');

correctPartOfSentence.value.pop();

// function isFirstWord(index : number) : boolean {
//     if (index == 0)
//         return true;
//     return false;
// }

// function isLastWord(index : number) : boolean {
//     if (index == currentWordIndex)
//         return true;
//     return false;
// }

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