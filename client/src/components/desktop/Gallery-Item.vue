<template>
  <div class="column gallery-item" @click="$parent.nav(nav_by-0)">
      <img :src="item.url" :alt="item.name" class="gallery-item image" @load="$parent.$set($parent.loading_gallery,nav_by-0+3,false)">
  </div>
</template>

<script>
export default {
    props:["item_","nav_by"],
    data(){return{item:JSON.parse(this.item_)}},
}
</script>

<style>
  .gallery-item.image{
    max-width:15vw;
    max-height:calc(20vh - 33px);
  }
  .gallery-item.column:hover{
    cursor:pointer;
    background-color:rgb(250, 250, 250);
  }
  .gallery-item.column{
    vertical-align:middle;
  }
</style>