<template>
    <a :href="'/@/'+_set+'/'+album.name" style="text-decoration:none;">    
      <div class="album-show" :style="{'float':index==0?'left':'none','display':index!=0?'inline-block':'inline'}">
        <div class="album-main" :style="{'float':index==0?'left':'none','display':index!=0?'inline-block':'inline','min-height':index==0?'calc(50vh - 5.4px)':'calc(50vh - 9.7px)'}">
            <div class="loading-album-show" v-if="loading"><a class="loading-album-show-text">battling images 🏰⚔️<br></a></div>
            <img :src="album.image" style="width:300px;" v-show="!loading" @load="loading=false"><br>
            <b class="album-name">{{album.name}}</b>
            <a class="album-description">{{album.description}}</a>
        </div>
      </div>
    </a>
</template>

<script>
export default {
    props:["album","_set","index"],
    data(){
        return{
            loading:true,
        }
    }
}
</script>

<style scoped>
  .album-main{
    width:300px;
    margin-top:5px;
    overflow-x:hidden;
    background-color: lightgray;
    overflow-y:auto;
    word-wrap:break-all;
    cursor: pointer;
  }
  .album-name,.album-description,.loading-album-show-text{
    font-family: 'Roboto', sans-serif;
  }
  .album-name{
    font-size:18px;
    margin-left:5px;
    color:white;
    text-decoration: none;
  }
  .album-description{
    font-size:15px;
    color:white;
    text-decoration: none;
  }
  .loading-album-show-text{
    color:white;
    text-decoration: none;
    display: table-cell; 
    background-color: lightgray;
    vertical-align: middle; 
    text-align: center; 
  }
  .loading-album-show{
    display: table;
    width:300px;
    height:20vh;
  }
  .album-main,.album-show{
    background-color: lightgray;
  }
</style>