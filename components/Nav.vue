<template>
    <div class="h-20 bg-gray-800 flex items-center justify-center">
      <div class="flex items-center">
        <div>
          <Avatar :src="imagenLink" class="rounded-full mr-5" />
        </div>
        <h1 class="text-white text-xs sm:text-3xl ">{{ title }}</h1>
      </div>
    </div>
</template>

  
  
<script>
  export default {
    data() {
      return {
        title: "Hogwarts School of Witchcraft and Wizardry", // Hogwarts full name
        imagenLink: 'hogwarts.png',  // Hogwarts logo
      };
    },
  };
</script>
