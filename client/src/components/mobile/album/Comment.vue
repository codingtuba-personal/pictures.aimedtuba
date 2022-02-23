<template>
  <span>
      <b class="user">{{username}}</b>
      <a class="content">{{content}}</a>
  </span>
</template>

<script>
export default {
    props:["content","username"]
}
</script>

<style>

</style>