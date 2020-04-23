<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <ChatCreator>
      the creator
    </ChatCreator>
  </div>
</template>

<style>
</style>

<script>
  // @ is an alias to /src
  import ChatCreator from '@/components/ChatCreator'

  export default {
    name: 'Home',
    components: {
      ChatCreator
    }
  }
</script>
