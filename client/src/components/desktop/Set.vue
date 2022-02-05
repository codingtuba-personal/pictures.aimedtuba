<template>
  <div class="set-show" @click="albums()">
    <a :href="'/@/'+set.name">    
      <div class="set-main">
        <div class="loading-set-show" v-if="loading"><a class="loading-set-show-text">battling images 🏰⚔️<br></a></div>
        <img :src="set.image" style="width:300px;" v-show="!loading" @load="loading=false">
        <a class="set-name">{{set.name}}</a>
        <a class="set-description">{{set.description}} ({{set.albums.length}} album(s))</a>
      </div>
    </a>
    <span class="album">
      <div class="album-show" v-for="album in albums" :key="album.name"></div>
    </span>
  </div>
</template>

<script>
export default {
  props:["set"],
  data(){
    return{
      loading:true,
    }
  }
}
</script>

<style>
  .set-show{
    width:300px;
    margin-top:5px;
    border:lightgray 2px solid;
    border-radius:5px;
    overflow-x:hidden;
    overflow-y:auto;
    min-height:50vh;
    word-wrap:break-all;
    cursor: pointer;
  }
  .set-name,.set-description,.loading-set-show-text{
    font-family: 'Roboto', sans-serif;
  }
  .set-name{
    font-size:18px;
    margin-left:5px;
    color:rgb(150, 150, 150);
  }
  .set-description{
    font-size:15px;
    color:lightgray;
  }
  .loading-set-show-text{
    color:rgb(150, 150, 150);
    display: table-cell; 
    vertical-align: middle; 
    text-align: center; 
  }
  .loading-set-show{
    display: table;
    width:300px;
    height:20vh;
  }
  .set-main,.album-show{
    display:inline-block;
  }
</style>