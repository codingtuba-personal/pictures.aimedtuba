<template>
  <div>
      <span v-if="!loading.items">
        <span v-if="isMobile()">
            <mobile-album :_images="JSON.stringify(items)"></mobile-album>
        </span>
        <span v-else>
            <desktop-album :_images="JSON.stringify(items)"></desktop-album>
        </span>
      </span>
      <div class="loading" style="display:table;width:100vw;height:calc(100vh - 35px)" v-else>
          <a class="loading-text" style="display:table-cell;vertical-align: middle;text-align: center;color: gray;font-family: 'Roboto', sans-serif;">pirating images 🏴‍☠️🌃</a>
      </div>
  </div>
</template>

<script>
import cookies from "../cookies"
import swal from "sweetalert"
import Swal from "sweetalert2"
import MobileAlbum from "../components/mobile/Album-Display"
import DesktopAlbum from "../components/desktop/Album-Display"

export default {
    data(){
        return{
            loading:{
                items:true,
            },
            items:[]
        }
    },
    mounted(){
        fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/images?code=${cookies.getCookie('code')}&set=${this.$route.params.set}&album=${this.$route.params.album}`).then(r=>{
            if(!r.ok){
                swal({
                    title:"This album doesn't exist",
                    text:"you will be redirected soon",
                    icon:"error",
                    buttons:false,
                    timer:2000,
                }).then(()=>{
                    location.replace(`/@/${this.$route.params.set}/`)
                })
            }else{
                r.json().then(data=>{
                    console.log(data)
                    this.items=data
                    this.loading.items=false
                })
            }
        })
    },
    components:{
        "mobile-album":MobileAlbum,
        "desktop-album":DesktopAlbum,
    },
    methods:{
        isMobile(){
            return /iPhone|iPod/i.test(navigator.userAgent)
        }
    }
}
</script>

<style>
    .swal-title,.swal-text{
        font-family: 'Roboto', sans-serif;
    }
</style>