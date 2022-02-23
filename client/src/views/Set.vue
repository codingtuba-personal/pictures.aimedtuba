<template>
  <div>
      <div class="loading" style="display:table;width:100vw;height:calc(100vh - 35px)" v-if="loading">
          <a class="loading-text" style="display:table-cell;vertical-align: middle;text-align: center;color: gray;font-family: 'Roboto', sans-serif;">absorbing albums 😇📚</a>
      </div>
      <table style="width:100%" class="albums-table" v-else>
          <tbody>
            <tr v-for="(album,index) in albums" class="album" :key="album.name" :style="{'width':'100%','overflow-x':'auto','word-break':'break-all','background-color':index/2%1===0?'white':'lightgray'}">
                <td>
                    <a :href="'/@/'+$route.params.set+'/'+album.name" style="text-decoration:none;">
                        <b class="album-title roboto-sans-serif" :style="{'color':index/2%1!==0?'white':'lightgray','text-decoration':'none'}">{{album.name}} </b>
                        <a class="album-description roboto-sans-serif" :style="{'color':index/2%1!==0?'white':'lightgray','text-decoration':'none'}">{{album.description}} </a>
                    </a>
                </td>
            </tr>
          </tbody>
      </table>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import swal from 'sweetalert'
import cookies from '../cookies'

export default {
    data(){
        return{
            loading:true,
            albums:[],
        }
    },
    mounted(){
        fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/album?code=${cookies.getCookie('code')}&set=${this.$route.params.set}`).then(res=>{
            if(!res.ok){
                swal({
                    title:"This set doesn't exist",
                    text:"you will be redirected soon",
                    icon:'error',
                    buttons:false,
                    timer:3000,
                }).then(()=>location.replace('/'))
            }else{
                res.json().then(data=>{
                    this.albums=data
                    this.loading=false
                })
            }
        }).catch(e=>{
            swal({
                title:"This set doesn't exist",
                text:"you will be redirected soon",
                icon:'error',
                buttons:false,
                timer:3000,
            }).then(()=>location.replace('/'))
        })
    },
    methods: {
        _create(){
            let constructor={
                name:null, description:null, image:null, 
                images:[],
                set:{name:this.$route.params.set},
            }
            Swal.fire({
                title: 'Create album',
                showCancelButton: true,
                confirmButtonText: 'Next',
                html:`
                    <h3 class="roboto-sans-serif">Album name</h3>
                    <input type="text" class="swal2-input" placeholder="Album name" value="">
                    <h3 class="roboto-sans-serif">Album description</h3>
                    <textarea class="swal2-textarea" placeholder="Album description"></textarea>
                    <h3 class="roboto-sans-serif">Album image</h3>
                    <input type="text" class="swal2-input" placeholder="Album image" value="">
                `,
                focusConfirm: false,
                preConfirm: () => {
                    constructor.name=document.querySelector('.swal2-input').value
                    constructor.description=document.querySelector('.swal2-textarea').value
                    constructor.image=document.querySelectorAll('.swal2-input')[1].value
                }
            }).then(going=>{
                if(going.isConfirmed){
                    Swal.fire({
                        title: 'Add in the images',
                        showCancelButton: true,
                        html:`
                            <textarea class="swal2-textarea" placeholder="url [title]"></textarea>
                        `,
                        focusConfirm: false,
                        preConfirm: () => {
                            document.querySelector('.swal2-textarea').value.split('\n').forEach(i=>{
                                let _dummy=i.replace("]","").split(" [")
                                constructor.images.push({
                                    url:_dummy[0],
                                    name:_dummy[1],
                                })
                            })
                        }
                    }).then(()=>{
                        fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/album`,{
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            body:JSON.stringify({
                                codes:{
                                    website:cookies.getCookie('code'),
                                    admin:cookies.getCookie('admin')
                                },
                                set:this.$route.params.set,
                                constructor
                            })
                        }).then(r=>{
                            swal({
                                title:"Created album",
                                text:"you will be redirected soon",
                                icon:'success',
                                buttons:false,
                                timer:3000,
                            }).then(()=>location.replace(`/@/${this.$route.params.set}/${constructor.name}`))
                        })
                    })
                }
            })
        },
        edit(i){
            swal({
                title:'Editing "'+this.albums[i].name+'"',
                text:'What do you want to edit?',
                buttons:{
                    cancel:false,
                    Info:true,
                    Images:true,
                },
            }).then(c=>{
                if(c=="Info"){
                    let constructor=this.albums[i]
                    Swal.fire({
                        title: 'Editing "'+this.albums[i].name+'"',
                        showCancelButton: true,
                        html:`
                            <h3 class="roboto-sans-serif">Album name</h3>
                            <input type="text" class="swal2-input" placeholder="Album name" value="${this.albums[i].name}">
                            <h3 class="roboto-sans-serif">Album description</h3>
                            <textarea class="swal2-textarea" placeholder="Album description">${this.albums[i].description}</textarea>
                            <h3 class="roboto-sans-serif">Album image</h3>
                            <input type="text" class="swal2-input" placeholder="Album image" value="${this.albums[i].image}">
                        `,
                        focusConfirm: false,
                        preConfirm: () => {
                            constructor.title=document.querySelector('.swal2-input').value
                            constructor.description=document.querySelector('.swal2-textarea').value
                            constructor.image=document.querySelectorAll('.swal2-input')[1].value
                        }
                    }).then(going=>{
                        if(going.isConfirmed){
                            fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/album`,{
                                method:'PUT',
                                headers:{
                                    'Content-Type':'application/json'
                                },
                                body:JSON.stringify({
                                    codes:{
                                        website:cookies.getCookie('code'),
                                        admin:cookies.getCookie('admin')
                                    },
                                    name:this.albums[i].name,
                                    set:this.$route.params.set,
                                    constructor,
                                })
                            }).then(r=>{
                                swal({
                                    title:"Edited album",
                                    text:"you will be reloaded soon",
                                    icon:'success',
                                    buttons:false,
                                    timer:3000,
                                }).then(()=>location.reload())
                            })
                        }
                    })
                }else if(c=="Images"){
                    let constructor=this.albums[i]
                    constructor.title=this.albums[i].name
                    let formatted_images=""
                    constructor.images.forEach(i=>{
                        formatted_images+=`${i.url} [${i.name}]\n`
                    })
                    formatted_images=formatted_images.split('').reverse().join('').replace("\n","").split('').reverse().join('')
                    Swal.fire({
                        title:'Editing "'+this.albums[i].name+'"',
                        showCancelButton: true,
                        html:`
                            <textarea class="swal2-textarea" placeholder="url [title]">${formatted_images}</textarea>
                        `,
                        focusConfirm: false,
                        preConfirm: () => {
                            document.querySelector('.swal2-textarea').value.split('\n').forEach((i,d)=>{
                                let _dummy=i.replace("]","").split(" [")
                                try{
                                    constructor.images[d].url=_dummy[0]
                                    constructor.images[d].name=_dummy[1]
                                }catch(e){
                                    constructor.images.push({
                                        url:_dummy[0],
                                        name:_dummy[1],
                                    })
                                }
                            })
                            fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/album`,{
                                method:'PUT',
                                headers:{
                                    'Content-Type':'application/json'
                                },
                                body:JSON.stringify({
                                    codes:{
                                        website:cookies.getCookie('code'),
                                        admin:cookies.getCookie('admin')
                                    },
                                    set:this.$route.params.set,
                                    name:this.albums[i].name,
                                    constructor,
                                })
                            }).then(r=>{
                                swal({
                                    title:"Edited album",
                                    text:"you will be reloaded soon",
                                    icon:'success',
                                    buttons:false,
                                    timer:3000,
                                }).then(()=>location.reload())
                            })
                        }
                    })
                }
            })
        },
        delete(i){
            swal({
                title: 'Do you want to delete the album "'+this.albums[i].name+'"',
                text: "You won't be able to revert this!",
                icon: 'warning',
                buttons: true,
                dangerMode: true,
                allowOutsideClick:false,
                allowEscapeKey:false,
            }).then(willDelete => {
                if (willDelete) {
                    fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/album`,{
                        method:'DELETE',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body:JSON.stringify({
                            codes:{
                                website:cookies.getCookie('code'),
                                admin:cookies.getCookie('admin')
                            },
                            set:this.$route.params.set,
                            name:this.albums[i].name
                        })
                    }).then(r=>{
                        swal({
                            title:"Deleted album",
                            text:"reloading soon",
                            icon:'success',
                            buttons:false,
                            timer:3000,
                        }).then(()=>location.replace(`/@/${this.$route.params.set}`))
                    })
                }
            })
        }
    }
}
</script>

<style>
    .swal-text,.swal-title,.swal2-title,.roboto-sans-serif{
        font-family: 'Roboto', sans-serif;
    }
    .album-title{
        font-size:17.5px;
        color:gray;
    }
    .album-description{
        color:lightgray;
    }
</style>