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
<script>
  import { v4 as uuidv4 } from 'uuid';
  export default {
    data() {
      return {
        questionsData: [], // Array to store questions data.
        currentQuestionIndex: 0, // Index to keep track of the current question being displayed.
        // Scores for each Hogwarts house, initialized to zero.
        scores: { g: {name: 'Gryffindor 🦁', score: 0}, r: {name: 'Ravenclaw 🦅', score: 0}, h: {name: 'Hufflepuff 🦡', score: 0}, s: {name: 'Slytherin 🐍', score: 0} },
        questionsToShow: [], // Array to store questions to display.
        name: '', // User's name.
        hogwartsHouse: '',// The Hogwarts house that the user is assigned to.
      }
    },
    async mounted() {
      await this.asyncfetchJson();
    },
  
    methods: {
      // Generates a unique key using the uuidv4 library.
      generateUniqueKey() {
        return uuidv4();
      },
    
      // Returns a final message based on the user's name and selected Hogwarts house.
      finalMessage() {
        return `Thank you, ${this.name}. After careful consideration of your qualities and values,
                a decision has been made. You are destined for ${this.hogwartsHouse}, a place where your 
                unique talents will flourish. Welcome to your new home, where magical adventures await!`;
      },
    
      // Asynchronously fetches a JSON file containing questions.
      async asyncfetchJson() {
        try {
          const response = await fetch('/questions.json');
          if (response.ok) {
            this.questionsData = await response.json();
          } else {
            console.error('Network response ok but http response failed');
          }
        } catch (error) {
          console.error('Error loading JSON file:', error);
        }
      },
    
      // Handles user responses when a question is clicked updating the chat
      async onClickResponse(response) {
        let id;
        this.currentQuestionIndex++;
        let text = '';
      
        if (typeof response === 'string') {
          text = response;
          this.name = response;
        } else {
          text = response.title;
          this.updateGlobalScores(response.scores);
        }
      
      
        await new Promise(resolve => setTimeout(resolve, 500));
      
        id = this.generateUniqueKey()
        let newQuestion = {
          title: text,
          sender: true,
          answers: [],
          id,
          isVisible: false,
        };
      
        this.questionsToShow = [...this.questionsToShow, newQuestion];
      
        let question = this.questionsToShow.find((q) => q.id === id);
        question.isVisible = true;
      
        this.$refs.bottomScroll.scrollIntoView({ behavior: 'smooth' });
      
        if (this.currentQuestionIndex < this.questionsData.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
          id = this.generateUniqueKey();
          const nextQuestion = {
            ...this.questionsData[this.currentQuestionIndex],
            id,
            isVisible: false,
          };
          this.questionsToShow = [...this.questionsToShow, nextQuestion];
        } else {
          this.hogwartsHouse = this.calculateWinningHouse();
          id = this.generateUniqueKey();
          newQuestion = {
              title: finalMessage(),
              sender: false,
              answers: [],
              id,
              isVisible: false,
              last: true,
          };
          this.questionsToShow = [...this.questionsToShow, newQuestion];
        }
      
        await new Promise(resolve => setTimeout(resolve, 800));
      
        question = this.questionsToShow.find((q) => q.id === id);
        question.isVisible = true;
        await new Promise(resolve => setTimeout(resolve, 500));
        this.$refs.bottomScroll.scrollIntoView({ behavior: 'smooth' });
      },
    
      // Updates the global scores based on the user's responses.
      updateGlobalScores(scoresToAdd) {
        for (const category in scoresToAdd) {
          if (scoresToAdd.hasOwnProperty(category) && this.scores.hasOwnProperty(category)) {
            this.scores[category].score += scoresToAdd[category];
          }
        }
      },
    
      // Reloads the page.
      reloadPage() {
        window.location.reload();
      },
    
      // Calculates the winning Hogwarts house based on scores.
      calculateWinningHouse() {
        let winningHouse = '';
        let highestScore = 0;
      
        for (const house in this.scores) {
          if (this.scores.hasOwnProperty(house)) {
            const score = this.scores[house].score;
            if (score > highestScore) {
              highestScore = score;
              winningHouse = this.scores[house].name;
            }
          }
        }
      
        return winningHouse;
      },
    },
  
  }
</script>
