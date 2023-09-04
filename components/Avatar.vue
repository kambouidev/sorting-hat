<template>
    <img :src="src" class="w-14 h-14 sm:w-20 sm:h-20"/>
  </template>
  
<script>
  export default {
    props: { src: { type: String, default: '' } }
  }
</script>