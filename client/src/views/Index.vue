<template>
  <div id="app">
    <div class="loading-sets" style="display:table;width:100vw;" v-if="loading">
      <a class="loading-sets-text" style="display:table-cell;vertical-align: middle;text-align: center;color: gray;font-family: 'Roboto', sans-serif;">waking servers 🛏🧙🏻‍♂️</a>
    </div>
    <span v-else>
      <span v-if="isMobile()"><M_set :sets="sets"></M_set></span>
      <span v-else>
        <span v-for="set in sets" :key="set">
          <D_set :set="set"></D_set>
        </span>
      </span>
    </span>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import swal from 'sweetalert'
import cookies from '../cookies'
import M_set from '../components/mobile/Set.vue'
import D_set from '../components/desktop/Set.vue'

export default {
  data(){
    return{
      getCookie:cookies.getCookie,
      sets:[],
      loading:true,
    }
  },
  components:{
    M_set,D_set
  },
  methods:{
    isMobile(){
      return /iPhone|iPod/i.test(navigator.userAgent)
    }, 
    edit(i){
      Swal.fire({
        title: 'Edit "'+this.sets[i].name+'"',
        showCancelButton: true,
        confirmButtonText: 'Save',
        html:`
          <h3 class="roboto-sans-serif">Set name</h3>
          <input type="text" class="swal2-input" placeholder="Set name" value="${this.sets[i].name}">
          <h3 class="roboto-sans-serif">Set description</h3>
          <textarea class="swal2-textarea" placeholder="Set description">${this.sets[i].description}</textarea>
          <h3 class="roboto-sans-serif">Set image</h3>
          <input type="text" class="swal2-input" placeholder="Set image" value="${this.sets[i].image}">
        `,
        focusConfirm: false,
        preConfirm: () => {
          fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.aimedtuba.com'}:${location.port==8080?1000:""}/sets`,{
            method:'PUT',
            headers:{
              'Content-Type':'application/json',
            },
            body:JSON.stringify({
              title:this.sets[i].name,
              name:document.querySelector('.swal2-input').value,
              description:document.querySelector('.swal2-textarea').value,
              image:document.querySelectorAll('.swal2-input')[1].value,
              code:cookies.getCookie('code'),
              admin:cookies.getCookie('admin')
            })
          }).then(r=>{
            swal({
              title: 'Success',
              text: 'Set edited',
              icon: 'success',
            }).then(()=>this.$router.push(location.pathname))
          })
        },
      })
    },
    delete(i){
      swal({
        title:'Do you want to delete the set "'+this.sets[i].name+'"',
        text:"You won't be able to revert this!",
        type:"warning",
        icon:"warning",
        buttons:true,
        dangerMode:true,
      }).then(_delete=>{
        if(_delete==true){
          fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.aimedtuba.com'}:${location.port==8080?1000:""}/sets`,{
            method:'DELETE',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({
              title:this.sets[i].name,
              code:cookies.getCookie('code'),
              admin:cookies.getCookie('admin'),
            })
          }).then(r=>{
            swal({
              title:'Deleted!',
              text:"Your set has been deleted.",
              icon:"success",
            }).then(_=>{
              this.$router.push(location.pathname)
            })
          })
        }
      })
    },
    create(){
      Swal.fire({
        title:"Create your new set",
        showCancelButton:true,
        html:`
          <h3 class="roboto-sans-serif">Set name</h3>
          <input type="text" id="set_name" class="swal2-input" placeholder="Set name">
          <h3 class="roboto-sans-serif">Set description</h3>
          <textarea id="set_description" class="swal2-textarea" placeholder="Set description"></textarea>
          <h3 class="roboto-sans-serif">Set image</h3>
          <input type="text" id="set_image" class="swal2-input" placeholder="Set image">
        `,
        focusConfirm: false,
        preConfirm:()=>{
          fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.aimedtuba.com'}:${location.port==8080?1000:""}/sets`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              title:document.getElementById("set_name").value,
              description:document.getElementById("set_description").value,
              image:document.getElementById("set_image").value,
              codes:{
                website:cookies.getCookie('code'),
                admin:cookies.getCookie('admin'),
              }
            })
          }).then(res=>{
            swal({
              title:"Set created",
              text:"Your set has been created",
              icon:"success",
            }).then(()=>{
              this.$router.push(location.pathname)
            })
          })
        }
      })
    }
  },
  mounted(){
    fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.aimedtuba.com'}:${location.port==8080?1000:""}/sets?code=${cookies.getCookie('code')}`)
    .then(r=>r.json()).then(res=>{
      this.sets=res
      this.loading=false
    })
  }
}
</script>

<style>
  .top{
    width:calc(100% - 3px);
    height:30px;
    border: lightgray solid 2px;
    border-radius: 5px;
  }
  .loading-sets{
    height:calc(100vh - 35px)
  }
  .swal-title, .swal-text, .roboto-sans-serif, .swal2-title, .swal2-text{
    font-family: 'Roboto', sans-serif;
  }
</style>