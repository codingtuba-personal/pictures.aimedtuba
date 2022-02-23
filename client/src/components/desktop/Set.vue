<template>
  <span>
    <div class="set-show" @click="_albums()" @dblclick="_set()">
      <div class="set-main">
        <div class="loading-set-show" v-if="loading"><a class="loading-set-show-text">battling images 🏰⚔️<br></a></div>
        <img :src="set.image" style="width:300px;" v-show="!loading" @load="loading=false">
        <a class="set-name">{{set.name}}</a>
        <a class="set-description">{{set.description}} ({{set.albums.length}} album(s))</a>
      </div>
    </div>
    <div class="albums" v-if="album">
      <div class="-album-show" v-for="(album,index) in albums" :key="album.name">
        <span>
          <album :album="album" :_set="set.name" :index="index"></album>
        </span>
      </div>
    </div>
  </span>
</template>

<script>
import album from "../desktop/Album.vue"

export default {
  props:["set"],
  data(){
    return{
      loading:true,
      album:false,
      albums:[]
    }
  },
  methods:{
    _albums(){
      this.album=!this.album
    },
    _set(){
      location=`/@/${this.set.name}`
    }
  },
  components:{
    album
  },
  mounted(){
    this.albums=this.set.albums
  }
}
</script>

<style scoped>
  .set-show{
    width:300px;
    margin-top:5px;
    margin-left:5px;
    border:lightgray 2px solid;
    border-radius:5px 5px 0px 5px;
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
  .set-main,.set-show,.-album-show{
    float:left;
    display:inline;
  }
  .-album-show{
    margin-top:5px;
    border-top:white 4px solid;
  }
</style>