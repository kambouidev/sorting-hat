<script>
  export default {
    props: {
      text: { type: String, default: '' },
      sender: { type: Boolean, default: false },
      input: { type: Boolean, default: false },
      answers: { type: Array, default: [] },
      answerClickMethod: Function,
      reloadMethod: Function,
    },
    data() {
      return {
        photoUrl: 'sorting-hat.png',
        answered: false,
        inputText: ''
      }
    },
    computed: {
      buttonClass() {
        return this.inputText.length < 3 ? 'hover:bg-red-600' : 'hover:bg-blue-600';
      }
    },
    methods: {
      handleAnswerClick(item) {
        this.answered = true;
        this.answerClickMethod(item);
      },
    }
  }
</script>
<template>
  <Transition name="fade">
    <div class="flex mb-2 w-full" :class="sender ? 'justify-end' : ''">
      <Avatar class="m-1" v-if="!sender" :src="photoUrl" />
      <div
        class="flex flex-col max-w-[70%] w-full pt-2 sm:mr-2"
        :class="sender ? 'items-end' : ''"
      >
      <div
        class="px-3 py-2 rounded-2xl break-words w-fit text-justify text-xs sm:text-base"
        :class="sender ? 'bg-slate-50 mr-2' : 'bg-gray-800 text-white'">
        {{ text }}
      </div>
      <Transition name="fade">
        <div v-if="input && !answered" class="bg-gray-800 px-1 py-1 rounded-2xl break-words mt-2 w-fit flex items-center">
          <input
            v-model="inputText"
            type="text"
            class="flex-1 border bg-gray-200 m-1 py-1 px-2 focus:outline-none rounded-lg w-1/4"
            placeholder="Write here..."
          />
          <button
            @click="handleAnswerClick(inputText)"
            :class="buttonClass"
            :disabled="inputText.length < 3"
            class="hover:bg-blue-600 hover:text-white rounded-lg px-4 py-2"
          >
            <SendIcon />
          </button>
        </div>
      </Transition>
      <Transition name="fade">
        <div v-if="answers.length > 0 && !sender && !answered">
          <h3 class="p-2 text-black text-opacity-50 text-xs sm:text-base">choose one:</h3>
            <div class="w-full flex flex-row flex-wrap">
              <button
                v-for="(item, index) in answers"
                :key="index"
                class="flex-1 min-w-[50%] max-w-full p-1 " 
                @click="handleAnswerClick(item)"
              >
              <div class="hover:bg-blue-600 bg-gray-600 text-white p-2 rounded-2xl break-words text-center h-full flex items-center justify-center text-xs sm:text-base">
                {{ item.title }}
              </div>
            </button>
          </div>
        </div>
      </Transition>
      <div v-if="reloadMethod" class="mt-2">
          <button
            @click="reloadMethod"
            class="hover:bg-blue-600 bg-gray-600 text-white rounded-lg px-4 py-2 flex items-center"
          >
          <span class="mr-1">Try again</span>
            <ReloadIcon/>
          </button>
        </div>
    </div>
  </div>
  </Transition>
</template>