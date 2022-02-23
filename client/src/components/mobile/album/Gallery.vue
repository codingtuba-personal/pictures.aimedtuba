<template>
    <div class="gallery" v-if="show" v-show="!loading">
        <div class="gallery-past"><img :src="past.url" :alt="past.name" class="gallery" @click="$parent.nav(-1)" @load="loading=false"></div>
        <div class="gallery-present"><img :src="current.url" :alt="current.name" class="gallery"></div>
        <div class="gallery-future"><img :src="next.url" :alt="next.name" class="gallery" @click="$parent.nav(1)" @load="loading=false"></div>
    </div>  
</template>

<script>
export default {
    props:["current","past","next","show"],
    data(){
        return{
            loading:true,
            past_current:this.current
        }
    },
    mounted(){
        setInterval(()=>{
            if(this.past_current!=this.current){
                this.past_current=this.current
                this.loading=true
            }
        },100)
    }
}
</script>

<style>
.gallery {
    display:grid;
    grid-template-columns: 3;
    grid-template-rows: 1;
    grid-gap: 10px;
}
.gallery-past{
    grid-column: 1;
    grid-row: 1;
    width:33%;
}
.gallery-present{
    grid-column:2;
    grid-row:1;
    width:33%;
}
.gallery-future{
    grid-column:3;
    grid-row:1;
    width:33%;
}
img.gallery{
    width:25vw;
    margin:0 auto;
}
.gallery-present .gallery{
    opacity: 0.5;
}
</style>