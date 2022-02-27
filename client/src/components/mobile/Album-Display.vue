<template>
    <div class="display-main">
        <table style="width:100%">
            <tr class="up" @click="nav(-1)">⬆</tr>
            <tr class="content">
                <div class="content-wrapper-div">
                    <div class="loading" style="display:table;width:100%;height:calc(100vh - 35px)" v-if="loading">
                        <a class="loading-text" style="display:table-cell;vertical-align: middle;text-align: center;color: gray;font-family: 'Roboto', sans-serif;">taking image 😏💸</a>
                    </div>
                    <span v-show="!loading">
                        <img :src="images[current].url" :alt="images[current].name" class="content-image" @load="loading=false"><br>
                        <a class="content-title">{{images[current].name}}</a><br><br>
                    </span>
                    <gallery
                        v-if="options_.gallery"
                        :current="images[current]"
                        :next="current!=images.length-1?images[parseInt(current)+1]:images[0]"
                        :past="current!=0?images[current-1]:images[images.length-1]"
                        :show="!loading"
                    ></gallery>
                </div>
            </tr>
            <tr class="options">
                <select class="select-options" @change="option()">
                    <option value="-1" selected disabled>• • •</option>
                    <optgroup label="download">
                        <option value="download">download</option>
                        <option value="download_as">download as</option>
                    </optgroup>
                    <optgroup label="share">
                        <option value="url">url</option>
                        <option value="email">email</option>
                    </optgroup>
                    <optgroup label="viewing">
                        <option value="fullscreen">fullscreen</option>
                        <option value="gallery">toggle gallery</option>
                    </optgroup>
                    <optgroup label="social">
                        <option value="load_comments">load comments</option>
                        <option value="comment">comment</option>
                    </optgroup>
                    <optgroup label="large downloads">
                        <option value="download_album">download album</option>
                    </optgroup>
                </select>
            </tr>
            <tr class="down" @click="nav(1)">⬇</tr>
        </table>
    </div>
</template>

<script>
import JSZip from "jszip"
import Gallery from './album/Gallery.vue'
import Comment from './album/Comment.vue'
import cookies from '../../cookies'

if(!localStorage.getItem(this.$route.params.set+this.$route.params.album+"current")){
    localStorage.setItem(this.$route.params.set+this.$route.params.album+"current",0);
    localStorage.setItem("options",JSON.stringify({gallery:false}));
}

export default {
  components: { Gallery,Comment },
    props:["_images"],
    methods:{
        option(){
            this['o_'+document.querySelector(".select-options").value]();
            document.querySelector(".select-options").selectedIndex = 0;
        },
            o_download(){
                this.download(this.images[this.current].url,this.images[this.current].name.replaceAll(' ','-').replaceAll('.','').replaceAll(',','').toLowerCase()+"."+this.images[this.current].url.split('.')[this.images[this.current].url.split('.').length-1]);
            },
            o_download_as(){
                this.$swal({
                    icon: "question",
                    title: 'What do you want the file name to be?',
                    input: 'text',
                    inputValidator: (value) => {
                        return !value && 'Please input a file name!'
                    }
                }).then((result) => {
                    if (result.value) {
                        this.download(this.images[this.current].url,result.value+"."+this.images[this.current].url.split('.')[this.images[this.current].url.split('.').length-1]);
                    }
                })
            },
            o_url(){
                navigator.clipboard.writeText(this.images[this.current].url).then(()=>{
                    this.$swal({
                        icon: "success",
                        title: 'copied to clipboard',
                        text: 'url: '+this.images[this.current].url,
                        timer: 3000,
                        showConfirmButton: false
                    })
                },(err)=>{
                    this.$swal({
                        icon: "error",
                        title: 'Failed to copy to clipboard',
                        text: "looks like your browser is secure (let me guess, you're using safari)",
                    }).then(()=>{
                        this.$swal({
                            icon: "info",
                            title: "looks like you'll have to do it yourself",
                            input:"text",
                            inputValue:this.images[this.current].url,
                        })
                    })
                });
            },
            o_email(){
                this.$swal({
                    icon: "question",
                    title: 'Who do you want to email to?',
                    input: 'email',
                    inputValidator: (value) => {
                        return !value && 'Please input an email!'
                    }
                }).then((result) => {
                    if (result.value) {
                        location=`mailto:${result.value}?subject=${this.images[this.current].name} - pictures.aimedtuba.com&body=Check this image out here%0D%0A${this.images[this.current].url}`;
                    }
                })
            },
            o_fullscreen(){
                this.$swal({
                    imageUrl: this.images[this.current].url,
                    imageAlt: this.images[this.current].name,
                    showCloseButton: true,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                })
            },
            o_gallery(){
                this.options_.gallery = !this.options_.gallery
                localStorage.setItem("options",JSON.stringify(this.options_));
            },
            o_load_comments(){
                let html=`
                    <style>
                        .hidden-input{
                            display:none;
                        }
                    </style>
                `
                this.comments.forEach((i,d)=>{
                    html+=`
                        <span>
                            <b><input type="checkbox" data-tuba-id="${d}" class="${i.user.username==cookies.getCookie("username")?"options-input":"hidden-input"}"> ${i.user.username} </b>
                            <a>${i.content}</a><br><br>
                        </span>
                    `
                })
                this.$swal({
                    html: html,
                    preConfirm: ()=>{
                        let checked = document.querySelectorAll(".options-input:checked");
                        let ids = [];
                        checked.forEach((i)=>{
                            ids.push(i.dataset.tubaId);
                        })
                        if(ids.length>0){
                            this.delete_comments(ids);
                        }
                    }
                })
            },
            o_comment(){
                let content=""
                this.$swal({
                    icon: "question",
                    title: 'What do you want to comment?',
                    input: 'text',
                    inputValidator: (value) => {
                        return !value && 'Please input a comment!'
                    },
                    showCancelButton: true,
                }).then((result) => {
                    if (result.value) {
                        content=result.value;
                        fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.aimedtuba.com'}:${location.port==8080?1000:""}/comment`,{
                            method:"POST",
                            headers:{
                                "Content-Type":"application/json"
                            },
                            body:JSON.stringify({
                                content:content,
                                set:this.$route.params.set,
                                album:this.$route.params.album,
                                codes:{
                                    login:cookies.getCookie("account"),
                                    website:cookies.getCookie("code")
                                }
                            })
                        }).then(res=>res.json()).then(res=>{
                            if(res.success){
                                this.comments.push(res.comment);
                                this.comment = "";
                                this.$router.push(location.pathname)
                            }
                        })
                    }
                })
            },
            async o_download_album(){
                this.alert("starting image data transfer")
                let zip=new JSZip();
                for(let d=0;d<this.images.length;d++){
                    let i=this.images[d];
                    let image_data_fetch=await fetch(i.url)
                    let b=await image_data_fetch.blob()
                    this.alert("got image data from " + i.name + " (" + (d+1) + "/" + this.images.length + ")")
                    let bs64=await blobToBase64(b)
                    zip.file(i.name.replaceAll(' ','-').replaceAll('.','').replaceAll(',','').toLowerCase()+"."+i.url.split('.')[i.url.split('.').length-1],bs64.replace(/^data:image\/(png|jpg);base64,/,""),{base64:true});
                    if(d==this.images.length-1){
                        this.alert("finished image data transfer; creating zip file")
                        zip.generateAsync({type:"blob"}).then(bRes=>{
                            this.alert("downloading zip...")
                            let imageURL = URL.createObjectURL(bRes)
                            const link = document.createElement('a')
                            link.href = imageURL
                            link.download = decodeURIComponent(location.pathname.split("/")[location.pathname.split("/").length-1]).replaceAll(' ','-').replaceAll('.','').replaceAll(',','').toLowerCase()+".zip"
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                            this.$swal({text:" ",timer:1})
                        })
                        
                    }
                }

                // https://stackoverflow.com/a/18650249/17199922
                function blobToBase64(blob) {
                    return new Promise((resolve, _) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                }
            },
        nav(i){
            this.set(localStorage.getItem(this.$route.params.set+this.$route.params.album+"current")*1+i);
            console.log(localStorage.getItem(this.$route.params.set+this.$route.params.album+"current")*1+i)
        },
        set(n){
            if(n<0){this.set(this.images.length-1);n=this.images.length-1}
            if(n>=this.images.length){this.set(0);n=0}
            localStorage.setItem(this.$route.params.set+this.$route.params.album+"current",n);
            this.current=localStorage.getItem(this.$route.params.set+this.$route.params.album+"current");
            this.loading=true;
        },
        async download(_image,_name) {
            this.$swal({text:"Downloading file, please wait...",showConfirmButton:false});
            let image = await fetch(_image)
            let imageBlob = await image.blob()
            let imageURL = URL.createObjectURL(imageBlob)

            const link = document.createElement('a')
            link.href = imageURL
            link.download = _name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            this.$swal({text:" ",timer:1})
        },
        alert(text){
            this.$swal({
                html: text+"<style>.swal2-html-container{text-align:center}</style>",
                allowOutsideClick:false,
                allowEscapeKey:false,
                allowEnterKey:false,
                showConfirmButton:false,
            })
        },
        delete_comments(i){
            let formated=i.join(", ")
            this.$swal({
                dangerMode: true,
                title: 'Are you sure you want to delete these comments?<style>.swal2-html-container{text-align:center}</style>',
                text: "comments: "+formated,
                showCancelButton: true,
                confirmButtonText: 'Delete',
                icon: 'error'
            }).then(result => {
                if(result.value){
                    this.alert("deleting comments...")
                    i.forEach(async (_i,d)=>{
                        await fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.aimedtuba.com'}:${location.port==8080?1000:""}/comment`,{
                            method:"DELETE",
                            headers:{
                                "Content-Type":"application/json"
                            },
                            body:JSON.stringify({
                                codes:{
                                    login:cookies.getCookie("account"),
                                    website:cookies.getCookie("code")
                                },
                                id:this.comments[_i]._id
                            })
                        })
                        this.alert("deleted comment " + (d+1) + "/" + i.length)
                        if(d==i.length-1){
                            this.$swal({text:" ",timer:1})
                            this.comments=this.comments.filter((_,j)=>!i.includes(j))
                        }
                    })
                }
            })
        }
    },
    data(){
        return {
            options_:{gallery:false},
            current:0,
            images:[],
            loading:true,
            comments:[],
        }
    },
    mounted(){
        this.images=JSON.parse(this._images);
        this.current=localStorage.getItem(this.$route.params.set+this.$route.params.album+"current");
        this.options_=JSON.parse(localStorage.getItem("options"))
        fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.aimedtuba.com'}:${location.port==8080?1000:""}/comments?code=${cookies.getCookie('code')}&set=${this.$route.params.set}&album=${this.$route.params.album}`).then(r=>r.json()).then(response=>{
            this.comments=response
        })
    }
}
</script>

<style>
    .content-image{
        max-width: calc(100vw - 35px);
        max-height: 60vh;
        background-size: cover;
        background-repeat: no-repeat;
        margin: 0 auto;
    }
    table tr{
        display:flex;
        width:100%;
    }
    .up{
        border-radius: 5px 5px 0px 0px;
    }
    .down{
        border-radius: 0px 0px 5px 5px;
    }
    .up,.down,tr.options,.comments-go-back{
        justify-content:center;
        border:2px lightgray solid;
        color:lightgray;
        font-size:20px;
    }
    .comments-go-back{
        border:none;
        background-color:transparent;
        width:100%;
    }
    .options{
        border-bottom:none;
    }
    tr.content{
        height:70vh;
        border-left: 2px lightgray solid;
        border-right: 2px lightgray solid;
        justify-content:center;
        align-items:center;
        vertical-align: middle;
    }
    .content-title{
        text-align:center;
        font-family: 'Roboto', sans-serif;
        color:gray;
        font-size:20px;
    }
    .select-options{
        outline: none;
        text-align:center !important;
        height:20px;
        width:100%;
    }
    .swal2-title, .swal2-validation-message, .swal2-html-container, .roboto-sans-serif{
        font-family: 'Roboto', sans-serif;
    }
    .swal2-html-container{
        text-align: left;
        word-wrap: break-all;
        overflow: auto;
    }
</style>