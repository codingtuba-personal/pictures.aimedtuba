<template>
  <div class="mobile mobile-table">
    <div class="mobile mobile-table-cell nav-up arrow-nav nav-style" @click="nav(-1)">⬆</div>
    <div class="mobile mobile-table-cell set" @click="album=!album">
      <div class="set-show-content">
        <div class="loading-set-show" v-if="loading"><a class="loading-set-show-text">battling images 🏰⚔️<br></a></div>
        <img :src="sets[current].image" v-show="!loading" @load="loading=false" class="image-set image-style"><br><br>
        <a class="set-name" style="color:rgb(180, 180, 180);font-size:18px">{{sets[current].name}} </a>
        <a class="set-description" style="color:lightgray">{{sets[current].description}} ({{sets[current].albums.length}} album(s))</a><br><br>
      </div>
    </div>
    <span v-if="album">
      <router-link tag="a" v-for="(album,index) in sets[current].albums" :key="album.name" :to="'/@/'+sets[current].name+'/'+album.name" style="text-decoration:none;">
        <div class="mobile mobile-table-cell album">
          <div class="album-show-content">
            <div class="loading-album-show" v-if="album_images_loading[index]"><a class="loading-album-show-text">battling images 🏰⚔️<br></a></div>
            <img :src="album.image" v-show="!album_images_loading[index]" @load="load(index)" class="image-album image-style"><br><br>
            <div>            
              <a class="album-name" style="color:rgb(180, 180, 180);font-size:18px">{{album.name}} </a>
              <a class="album-description" style="color:lightgray">{{album.description}}</a><br><br>
            </div>
          </div>
        </div>
      </router-link>
    </span>
    <div class="mobile mobile-table-cell no-border-bottom nav-down arrow-nav nav-style" @click="nav(1)">⬇</div>
  </div>
</template>

<script>
if(!localStorage.getItem("mobile-sets-current")||localStorage.getItem("mobile-sets-current")==""){
  localStorage.setItem("mobile-sets-current",0)
}
export default {
  props:["sets"],
  data(){
    return{
      loading:true,
      album:false,
      current:parseInt(localStorage.getItem("mobile-sets-current")),
      album_images_loading:{},
    }
  },
  methods:{
    nav(i){
      if(i+this.current==-1){i=0}
      else if(i+this.current>=this.sets.length){i=0}
      this.current=i+this.current
      if(i!=0){
        this.loading=true
        this.album=false;
        this.album_images_loading=[];
        for(let i of Array(this.sets[this.current].albums.length).keys()){
          this.album_images_loading[i]=true
        }
      }
      localStorage.setItem("mobile-sets-current",this.current)
    },
    load(index){
      this.album_images_loading[index]=false
      let _dummy=this.album_images_loading
      this.album_images_loading=[];
      setTimeout(()=>this.album_images_loading=_dummy,100)
    }
  },
  mounted(){
    if(this.current==this.sets.length){this.current=0;localStorage.setItem("mobile-sets-current",0)}
    this.album_images_loading=[];
    for(let i of Array(this.sets[this.current].albums.length).keys()){
      this.album_images_loading[i]=true
    }
  }
}
</script>

<style>
  .mobile{
    width:100%;
    border-bottom: 2px solid lightgray;
  }
  .mobile-table{
    border:2px solid lightgray;
    display:table;
    border-radius: 5px;
    margin-top: 5px;
  }
  .no-border-bottom{
    border-bottom:none;
  }
  .arrow-nav{
    text-align: center;
  }
  .nav-style{
    font-family: 'Roboto', sans-serif;
    font-size:20px;
    color:lightgray;
  }
  .image-style{
    width:90%;
    margin-top:20px;
  }     
  .loading-set-show-text,.loading-album-show-text{
    color:rgb(150, 150, 150);
    display: table-cell; 
    vertical-align: middle; 
    text-align: center; 
  }
  .loading-set-show,.loading-album-show{
    display: table;
    width:calc(100% - 3px);
    height:300px;
  }
  .set-show-content,.album-show-content{
    width:calc(100% - 3px);
    text-align: center;
  }
  *{
    font-family: 'Roboto', sans-serif;
  }
</style>