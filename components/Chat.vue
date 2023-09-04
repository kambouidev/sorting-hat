<script setup>
import { ref, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const bottomScroll = ref(null);
const questionsData = ref([]);
const currentQuestionIndex = ref(0);
const scores = { g: {name: 'Gryffindor 🦁', score: 0}, r: {name: 'Ravenclaw 🦅', score: 0}, h: {name: 'Hufflepuff 🦡', score: 0}, s: {name: 'Slytherin 🐍', score: 0} };
const questionsToShow = ref([]);
const hasNewMessages = ref(false);
let name = '';
let hogwartsHouse = '';

const finalMessage = () => `Thank you, ${name}. After careful consideration of your qualities and values,
a decision has been made. You are destined for ${hogwartsHouse}, a place where your 
unique talents will flourish. Welcome to your new home, where magical adventures await!`;

onMounted(async () => {
  try {
    const response = await fetch('/questions.json');
    if (response.ok) {
      questionsData.value = await response.json();
      // questionsToShow.value.push(questionsData.value[currentQuestionIndex.value]);
    } else {
      console.error('Error al cargar el archivo JSON');
    }
  } catch (error) {
    console.error('Error al cargar el archivo JSON:', error);
  }
});

const generateUniqueKey = () => {
  return uuidv4();
};

const onClickResponse = async (response) => {
  let id;
  currentQuestionIndex.value++;
  let text = '';
  hasNewMessages.value = true;

  if (typeof response === 'string') {
    text = response;
    name = response;
  } else {
    text = response.title;
    updateGlobalScores(response.scores);
  }

  // bottomScroll.value?.scrollIntoView({ behavior: 'smooth' });

  await new Promise(resolve => setTimeout(resolve, 500));
  // bottomScroll.value?.scrollIntoView({ behavior: 'smooth' });
  id = generateUniqueKey()
  let newQuestion = {
    title: text,
    sender: true,
    answers: [],
    id,
    isVisible: false,
  };

  // Use the spread operator to avoid modifying the original array
  questionsToShow.value = [...questionsToShow.value, newQuestion];
  await new Promise(resolve => setTimeout(resolve, 500));

  let question = questionsToShow.value.find((q) => q.id === id);
  question.isVisible = true;

  if (currentQuestionIndex.value < questionsData.value.length) {
    await new Promise(resolve => setTimeout(resolve, 500));

    id = generateUniqueKey();
    const nextQuestion = {
      ...questionsData.value[currentQuestionIndex.value],
      id,
      isVisible: false,
    };

    // Use the spread operator to avoid modifying the original array
    questionsToShow.value = [...questionsToShow.value, nextQuestion];
    
  } else {
    hogwartsHouse = calculateWinningHouse();
    id = generateUniqueKey();
    newQuestion = {
        title: finalMessage(),
        sender: false,
        answers: [],
        id,
        isVisible: false,
        last: true,
    };
    questionsToShow.value = [...questionsToShow.value, newQuestion];
  }

  await new Promise(resolve => setTimeout(resolve, 800));

  question = questionsToShow.value.find((q) => q.id === id);
  question.isVisible = true;
  await new Promise(resolve => setTimeout(resolve, 500));

  bottomScroll.value?.scrollIntoView({ behavior: 'smooth' });
};

const updateGlobalScores = (scoresToAdd) => {
  for (const category in scoresToAdd) {
    if (scoresToAdd.hasOwnProperty(category) && scores.hasOwnProperty(category)) {
      scores[category].score += scoresToAdd[category];
    }
  }
};

const reloadPage = () => {
  window.location.reload();
};

const calculateWinningHouse = () => {
  let winningHouse = '';
  let highestScore = 0;

  for (const house in scores) {
    if (scores.hasOwnProperty(house)) {
      const score = scores[house].score;
      if (score > highestScore) {
        highestScore = score;
        winningHouse = scores[house].name;
      }
    }
  }

  return winningHouse;
};
</script>

<template>
  <div class="w-full h-4/5 pt-20 flex items-center justify-center">
    <div ref="scrollContainer" class="min-w-[320px] h-full max-w-[800px] w-full bg-slate-400 overflow-y-auto rounded-b-lg scrollbar-style">
      <div class="sticky top-0 left-0 w-full h-20 bg-gradient-to-b from-slate-500 to-transparent opacity-1"></div>
      <Transition name="fade">
        <Message
          v-if="questionsData.length > 0"
          :sender="false"
          :input="true"
          :text="'I am the Sorting Hat, and my task is to determine which Hogwarts house you belong to. Before revealing your destiny, I need to know a bit more about you. What is your name?'"
          :answerClickMethod="onClickResponse"
        />
      </Transition>
      <div v-for="(question) in questionsToShow" :key="question.id">
        <Transition name="fade">
            <Message
                v-if="question.isVisible"
                :sender="question.sender ?? false"
                :text="question.title"
                :answers="question.answers ?? []"
                :answerClickMethod="onClickResponse ?? null"
                :reloadMethod="question.last ? reloadPage : null"
            />
        </Transition>
      </div>
      <p ref="bottomScroll" class="p-2"></p>
    </div>
  </div>
</template>
