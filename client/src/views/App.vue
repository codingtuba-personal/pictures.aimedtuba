<template>
  <div id="app">
    <div class="top">
      <router-link to="/settings" tag="a" v-if="!admin_panel">settings</router-link>
      <router-link to="/" tag="a" v-if="!admin_panel">home</router-link>
      <a class="admin" href="javascript:nothing" @click.prevent @click="admin_panel=!admin_panel" v-if="getCookie('admin')" :class="{'admin-active':admin_panel}">admin {{admin_panel?">":"<"}}</a>
      <span v-if="admin_panel" class="admin-pannel">
        <span v-if="pathname()=='/'">
          <span v-if="!$refs.router.loading">
            <a 
              href="javascript:nothing" 
              @click.prevent 
              @click="$refs.router.create()" 
              class="admin-pannel-set-create"
              v-if="!admin.delete_set_pannel&&!admin.edit_set_pannel"
            >create set</a>
            <a 
              href="javascript:nothing" 
              @click.prevent 
              @click="admin.edit_set_pannel=!admin.edit_set_pannel" 
              :class="{'admin-active':admin.edit_set_pannel,'admin-pannel-set-edit':true}"
              v-if="!admin.delete_set_pannel"
            >edit set {{admin.edit_set_pannel?">":"<"}}</a>
            <a 
              href="javascript:nothing" 
              @click.prevent 
              @click="admin.delete_set_pannel=!admin.delete_set_pannel" 
              v-if="!admin.edit_set_pannel"
              :class="{'admin-active':admin.delete_set_pannel,'admin-pannel-set-delete':true}"
            >delete set {{admin.delete_set_pannel?">":"<"}}</a>
            <span class="admin-pannel-all-sets" v-if="admin.delete_set_pannel||admin.edit_set_pannel">
              <span v-for="(set,index) in $refs.router.sets" :key="set.name">
                <a href="javascript:nothing" @click.prevent @click="preform(index)" class="admin-pannel-set-from-list">{{set.name}}</a>
              </span>
            </span>
          </span>
          <a class="admin-sets-loading-text" v-else>begging servers 🙏🏻🧙🏻‍♂️</a>
        </span>
        <span v-else-if="pathname().split('/').length==3||(pathname().split('/').length==4&&pathname().endsWith('/'))">
          <span v-if="!$refs.router.loading">
            <a 
              href="javascript:nothing"
              @click.prevent
              @click="$refs.router._create()"
              class="admin-album-sets-create"
              v-if="!admin.delete_album_pannel&&!admin.edit_album_pannel"
            >create album</a>
            <a 
              href="javascript:nothing"
              @click.prevent
              @click="admin.edit_album_pannel=!admin.edit_album_pannel"
              :class="{'admin-active':admin.edit_album_pannel,'admin-pannel-album-edit':true}"
              v-if="!admin.delete_album_pannel"
            >edit album {{admin.edit_album_pannel?">":"<"}}</a>
            <a 
              href="javascript:nothing"
              @click.prevent
              @click="admin.delete_album_pannel=!admin.delete_album_pannel"
              v-if="!admin.edit_album_pannel"
              :class="{'admin-active':admin.delete_album_pannel,'admin-pannel-album-delete':true}"
            >delete album {{admin.delete_album_pannel?">":"<"}}</a>
            <span class="admin-pannel-all-albums" v-if="admin.delete_album_pannel||admin.edit_album_pannel">
              <span v-for="(album,index) in $refs.router.albums" :key="album.name">
                <a href="javascript:nothing" @click.prevent @click="preform(index)" class="admin-pannel-album-from-list">{{album.name}}</a>
              </span>
            </span>
          </span>
          <a class="admin-sets-loading-text" v-else>begging albums 🙏🏻🏞</a>
        </span>
      </span>
    </div>
    <component :is="getCookie('code')?'router-view':''" ref="router"></component>
  </div>
</template>

<script>
import cookies from "../cookies"

export default {
  data() {
    return {
      getCookie:cookies.getCookie,
      admin_panel:false,
      path:location.pathname,
      admin:{
        edit_set_pannel:false,
        delete_set_pannel:false,
        edit_album_pannel:false,
        delete_album_pannel:false,
      }
    }
  },
  mounted() {
    if(!!new URLSearchParams(window.location.search).get('code')){
      cookies.setCookie('code',new URLSearchParams(window.location.search).get('code'),99999);
      location.replace(window.location.pathname)
    }
    if(!!new URLSearchParams(window.location.search).get('tuba-login')){
      let _tuba=new URLSearchParams(window.location.search)
      fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/user`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({
          login:_tuba.get('tuba-login'),
          username:_tuba.get('tuba-username'),
          email:_tuba.get('tuba-email'),
          code:cookies.getCookie('code')
        }),
      }).then(()=>{
        cookies.setCookie('account',_tuba.get('tuba-login'));
        location.replace(window.location.pathname)
      })
    }else if(!cookies.getCookie('account')){
      location.replace(`https://accounts.aimedtuba.com/login?@redirect=v2:http://${location.hostname}:${location.port}${location.pathname}&$params=tuba-login,tuba-username,tuba-email&$tuba-login=$login&$tuba-username=$username&$tuba-email=$email`)
    }
  },
  methods:{
    pathname(){
      return location.pathname
    },
    preform(index){
      if(this.admin.edit_set_pannel==true){
        this.$refs.router.edit(index)
      }else if(this.admin.delete_set_pannel==true){
        this.$refs.router.delete(index)
      }else if(this.admin.edit_album_pannel==true){
        this.$refs.router.edit(index)
      }else if(this.admin.delete_album_pannel==true){
        this.$refs.router.delete(index)
      }
    }
  }
}
</script>

<style scoped>
  .top{
    width:calc(100% - 3px);
    height:fit-content;
    border: lightgray solid 2px;
    border-radius: 5px;
    font-family: 'Roboto', sans-serif;
    overflow-x:auto;
  }
  .top a{
    color:lightgray;
    font-size:25px;
    margin-left:5px;
    display:normal !important;
  }
  .top a.router-link-exact-active,.top a.admin-active{
    color:gray;
  }
</style>