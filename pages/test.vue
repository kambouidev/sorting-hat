<script>
export default {
  data() {
    return {
      name: '',                   // Nombre del usuario
      chatMessages: [],            // Historial de mensajes del chat
      showOptions: false,          // Mostrar opciones de respuesta
      currentQuestionIndex: -1,    // Índice de la pregunta actual
      questions: [                 // Definición de las preguntas
        {
          text: '¿Qué animal te gusta más?',
          options: ['Gato', 'Perro', 'Lechuza'],
          answer: null
        },
        // Agrega más preguntas aquí
      ]
    };
  },
  methods: {
    startChat() {
      if (this.name.trim() === '') {
        return;
      }

      // Inicializa la conversación con un saludo y la primera pregunta
      this.chatMessages.push(`¡Hola, ${this.name}! Soy el Sombrero Seleccionador.`);
      this.showOptions = true;
      this.nextQuestion();
    },
    nextQuestion() {
      // Avanza a la siguiente pregunta
      this.currentQuestionIndex++;

      // Si hay más preguntas, muestra las opciones de respuesta
      if (this.currentQuestionIndex < this.questions.length) {
        this.chatMessages.push(this.questions[this.currentQuestionIndex].text);
      } else {
        // Si no hay más preguntas, determina la casa
        this.determineHouse();
      }
    },
    selectAnswer(answerIndex) {
      // Registra la respuesta del usuario
      const selectedOption = this.questions[this.currentQuestionIndex].options[answerIndex];
      this.questions[this.currentQuestionIndex].answer = selectedOption;
      this.chatMessages.push(`Seleccionaste: ${selectedOption}`);

      // Pasa a la siguiente pregunta
      this.showOptions = false;
      this.nextQuestion();
    },
    determineHouse() {
      // Lógica para determinar la casa basada en las respuestas
      // Aquí debes implementar tu propia lógica de selección de casa
      // Por ejemplo, puedes hacerlo aleatoriamente o basado en las respuestas.
      // Luego, muestra la casa asignada al usuario.
      const selectedHouse = 'Gryffindor'; // Aquí deberías determinar la casa
      this.chatMessages.push(`¡Felicidades! Estás en la casa ${selectedHouse}.`);
    }
  }
};
</script>

<template>
    <div class="chat-container">
      <div class="chat">
        <div class="chat-messages">
          <!-- Mostrar mensajes de chat aquí -->
          <div class="message">
            <div class="message-bubble">¡Hola! Soy el Sombrero Seleccionador. ¿Cuál es tu nombre?</div>
          </div>
          <!-- Mensajes anteriores -->
          <div v-for="(message, index) in chatMessages" :key="index" class="message">
            <div class="message-bubble">{{ message }}</div>
          </div>
        </div>
        <div class="chat-input">
          <!-- Campo de entrada para el nombre -->
          <input v-model="name" @keyup.enter="sendMessage" placeholder="Tu nombre">
          <!-- Opciones de respuesta a la pregunta actual -->
          <div v-if="questions[currentQuestionIndex]" class="options">
            <button
              v-for="(option, index) in questions[currentQuestionIndex].options"
              :key="index"
              @click="selectAnswer(index)"
            >
              {{ option }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  <style scoped>
  .chat-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f0f0;
  }
  
  .chat {
    max-width: 800px;
    max-height: 800px;
    width: 100%;
    height: 80%;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    border-color: green;
    border-width: 10px;
  }
  
  .chat-messages {
    padding: 10px;
    height: 300px;
    overflow-y: scroll;
  }
  
  .message {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
  }
  
  .message-bubble {
    background-color: #e5e5ea;
    padding: 8px 12px;
    border-radius: 16px;
    max-width: 70%;
    word-wrap: break-word;
  }
  
  .chat-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-top: 1px solid #e5e5ea;
  }
  
  input {
    flex-grow: 1;
    border: none;
    outline: none;
    padding: 8px 12px;
    border-radius: 20px;
    margin-right: 10px;
  }
  
  .options {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  button {
    background-color: #007bff;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  