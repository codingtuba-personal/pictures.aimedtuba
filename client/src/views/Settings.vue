<template>
    <div id="app">
        <div class="email-settings">
            <div class="loading-email-settings" v-if="loading">
                <div>finding settings 🌴🗺️</div>
            </div>
            <div class="email-settings-loaded" v-else>
                <h3>Sets</h3>
                <input type="checkbox" class="sets-settings-email dictator" @change="change('sets')"> <a class="setings-email-text">All</a><br>
                <div class="indent">
                    <input type="checkbox" class="sets-settings-email" @change="click([0],true)"> <a class="setings-email-text">Creation</a><br>
                    <input type="checkbox" class="sets-settings-email" @change="click([1],true)"> <a class="setings-email-text">Edits</a><br>
                    <input type="checkbox" class="sets-settings-email" @change="click([2],true)"> <a class="setings-email-text">Deletion</a>
                </div>
                <h3>Albums</h3>
                <input type="checkbox" class="album-settings-email dictator" @change="change('albums')"> <a class="setings-email-text">All</a><br>
                <div class="indent">
                    <input type="checkbox" class="album-settings-email" @change="click([3],true)"> <a class="setings-email-text">Creation</a><br>
                    <input type="checkbox" class="album-settings-email" @change="click([4],true)"> <a class="setings-email-text">Edits</a><br>
                    <input type="checkbox" class="album-settings-email" @change="click([5],true)"> <a class="setings-email-text">Deletion</a>
                </div>
                <h3></h3>
            </div>
        </div>
        <input class="admin-login" placeholder="admin passcode" @paste="try_admin()" @keyup.enter="try_admin()">
    </div>
</template>

<script>
import cookies from "../cookies"

export default {
    data(){
        return{
            loading:true,
            allowed:true,
            settings:{
                sets:{
                    created:true,
                    edited:false,
                    deleted:false,
                },
                albums:{
                    created:true,
                    edited:false,
                    deleted:false,
                },
            },
            getCookie:cookies.getCookie,
        }
    },
    mounted() {
        fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/settings?code=${cookies.getCookie('code')}&login=${cookies.getCookie('account')}`).then(r=>r.json()).then(res=>{
            this.settings=res
            this.loading=false
            setTimeout(()=>{
                let _={s:this.settings.sets,a:this.settings.albums}
                if(_.s.created){
                    this.click([0],false,false,true)
                }
                if(_.s.edited){
                    this.click([1],false,false,true)
                }
                if(_.s.deleted){
                    this.click([2],false,false,true)
                }
                if(_.a.created){
                    this.click([3],false,false,true)
                }
                if(_.a.edited){
                    this.click([4],false,false,true)
                }
                if(_.a.deleted){
                    this.click([5],false,false,true)
                }
                if(_.s.created&&_.s.edited&&_.s.deleted){
                    document.querySelector(".sets-settings-email.dictator").setAttribute("checked","checked")
                }
                if(_.a.edited&&_.a.deleted&&_.a.created){
                    document.querySelector(".album-settings-email.dictator").setAttribute("checked","checked")
                }
            },1)
        })
    },
    methods:{
        change(type){
            if(type=="sets"){
                document.querySelectorAll(".indent input[type=checkbox]").forEach((e,i)=>{
                    if(i<3){e.checked=document.querySelector(".sets-settings-email").checked}
                    this.settings.sets.created=document.querySelector(".sets-settings-email").checked
                    this.settings.sets.edited=document.querySelector(".sets-settings-email").checked
                    this.settings.sets.deleted=document.querySelector(".sets-settings-email").checked
                })
            }else if(type=="albums"){
                document.querySelectorAll(".indent input[type=checkbox]").forEach((e,i)=>{
                    if(i>2){e.checked=document.querySelector(".album-settings-email").checked}
                    this.settings.albums.created=document.querySelector(".album-settings-email").checked
                    this.settings.albums.edited=document.querySelector(".album-settings-email").checked
                    this.settings.albums.deleted=document.querySelector(".album-settings-email").checked
                })
            }
            this.update()
        },
        click(i,doubble=false,save=true,setup=false){
            i.forEach(item=>{
                let e=document.querySelectorAll(".indent input[type=checkbox]")[item]
                e.checked=!e.checked
                if(item==0) this.settings.sets.created=e.checked
                else if(item==1) this.settings.sets.edited=e.checked
                else if(item==2) this.settings.sets.deleted=e.checked
                else if(item==3) this.settings.albums.created=e.checked
                else if(item==4) this.settings.albums.edited=e.checked
                else if(item==5) this.settings.albums.deleted=e.checked
            })
            if(save==true) console.log(this.settings)
            if(doubble==true) this.click([i],false,false)
            else if(setup==false) this.update()
        },
        update(){
            if(this.allowed==true){
                this.allowed=false
                fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/settings`,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        settings:this.settings,
                        login:cookies.getCookie('account'),
                        code:cookies.getCookie('code')
                    }),
                }).then(()=>{this.allowed=true})
            }
        },
        try_admin(){
            setTimeout(()=>{
                document.querySelector`.admin-login`.setAttribute("disabled", "disabled")
                fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.'+location.hostname.replace('www.','')}:${location.port==8080?1000:""}/admin`,{
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify({
                        code:cookies.getCookie('code'),
                        admin:document.querySelector(`.admin-login`).value
                    }),
                }).then(r=>r.text()).then(res=>{
                    if(res=="true"){
                        cookies.setCookie('admin',document.querySelector(`.admin-login`).value)
                        document.querySelector(`.admin-login`).value=""
                        document.querySelector(`.admin-login`).classList.add("green-input")
                        document.querySelector(`.admin-login`).classList.remove("red-input")
                        document.querySelector(`.admin-login`).placeholder="reloading in 3..."
                        setTimeout(()=>{document.querySelector(`.admin-login`).placeholder="reloading in 2..."},1000)
                        setTimeout(()=>{document.querySelector(`.admin-login`).placeholder="reloading in 1..."},2000)
                        setTimeout(()=>{document.querySelector(`.admin-login`).placeholder="reloading in 0..."},3000)
                        setTimeout(()=>{location.reload()},3100)
                    }else{
                        document.querySelector(`.admin-login`).classList.add("red-input")
                        document.querySelector(`.admin-login`).classList.remove("green-input")
                        document.querySelector(`.admin-login`).removeAttribute("disabled")
                    }
                })
            })
        }
    }
}
</script>

<style>
    .email-settings{
        height:fit-content;
        width:calc(100% - 3px);
        word-wrap:break-word;
        border:lightgray 2px solid;
        border-radius:5px;
        margin-top:5px;
    }
    input[type=checkbox]{
        width:20px;
        height:20px;
        margin-left:5px;
        border:lightgray 2px solid;
        border-radius:5px;
    }
    input[type=checkbox]:before{
        content:"";
        display:block;
        height:16px;
        width:16px;
        border:lightgray 2px solid;
        border-radius:5px;
        position:relative;
        background-color: white;
    }
    input[type=checkbox]:checked:before{
        content:"✅";
        height:16px;
        width:16px;
        display: table-cell;
        text-align: center; /* H align */
        vertical-align: middle;
        border:lightgray 2px solid;
        border-radius:5px;
        background-color:white;
        font-size:10px;
    }
    .indent{
        margin-left:25px;
    }
    h3,.setings-email-text{
        color:lightgray;
    }
    .loading-email-settings,h3,.setings-email-text{
        font-family: 'Roboto', sans-serif;
    }
    .loading-email-settings{
        color:gray;
        height: 25vh;
        text-align: center;
    }
    .loading-email-settings div{
        margin-top:calc(25vh - 25px);
    }
    .email-settings-loaded{
        margin-left: 10px;
    }
    .admin-login{
        margin-top:5px;
        width:calc(100% - 3px);
        border:2px solid lightgray;
        border-radius:5px;
        font-size:15px;
        height:20px;
        text-align: center;
        outline: none;
        color:lightgray;
    }
    .admin-login::placeholder{
        font-style: italic;
        color:lightgray;
    }
    .green-input{
        border:green 2px solid;
        color:green;
    }
    .red-input{
        border:red 2px solid;
        color:red;
    }
    .green-input::placeholder{
        color:green;
    }
    .red-input::placeholder{
        color:red;
    }
</style>