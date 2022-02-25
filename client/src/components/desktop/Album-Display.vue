<template>
    <div class="root">
        <div class="row">
            <div class="column options" @click="options()">•<br>•<br>•</div>
            <div class="column content">
                <div class="root content">
                    <div class="row content">
                        <div class="column content">
                            <div class="loading" style="display:table;width:100%;height:75vh" v-if="loading">
                                <a class="loading-text" style="display:table-cell;vertical-align: middle;text-align: center;color: gray;font-family: 'Roboto', sans-serif;">taking image 😏💸</a>
                            </div>
                            <img :src="this.images[this.current].url" :alt="this.images[this.current].name" class="content image" @load="loading=false" v-show="!loading">
                            <h2 class="content title" v-if="!loading">{{this.images[this.current].name}}</h2>
                        </div>
                    </div>
                    <div class="row content gallery" v-if="options_.gallery">
                        <div class="column content gallery">
                            <div class="root content gallery">
                                <div class="row gallery gallery-row" v-if="!loading" v-show="(!loading_gallery[0])&&(!loading_gallery[1])&&(!loading_gallery[2])&&(!loading_gallery[3])&&(!loading_gallery[4])&&(!loading_gallery[5])&&(!loading_gallery[6])">
                                    <gallery-item :item_="gallery_distance_n3" nav_by="-3" class="column content gallery-item" v-if="!calbraiting_gallery"></gallery-item>
                                    <gallery-item :item_="gallery_distance_n2" nav_by="-2" class="column content gallery-item" v-if="!calbraiting_gallery"></gallery-item>
                                    <gallery-item :item_="gallery_distance_n1" nav_by="-1" class="column content gallery-item" v-if="!calbraiting_gallery"></gallery-item>
                                    <gallery-item :item_="gallery_distance_p1" nav_by="1" class="column content gallery-item" v-if="!calbraiting_gallery"></gallery-item>
                                    <gallery-item :item_="gallery_distance_p2" nav_by="2" class="column content gallery-item" v-if="!calbraiting_gallery"></gallery-item>
                                    <gallery-item :item_="gallery_distance_p3" nav_by="3" class="column content gallery-item" v-if="!calbraiting_gallery"></gallery-item>
                                </div>
                            </div>
                            <div class="loading" style="display:table;width:calc(100%);height:calc(22vh - 33px)" v-if="!((!loading_gallery[0])&&(!loading_gallery[1])&&(!loading_gallery[2])&&(!loading_gallery[3])&&(!loading_gallery[4])&&(!loading_gallery[5])&&(!loading_gallery[6]))">
                                <a class="loading-text" style="display:table-cell;vertical-align: middle;text-align: center;color: gray;font-family: 'Roboto', sans-serif;">grabbing gallery 🤌🏻🏞</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import JSZip from "jszip"
import cookies from '../../cookies'
import GalleryItem from './Gallery-Item'

if(!localStorage.getItem("current")){
    localStorage.setItem("current",0);
    localStorage.setItem("options",JSON.stringify({gallery:false}));
}

export default {
    props:["_images"],
    methods:{
        options(){
            this.$swal({
                title: 'options',
                input: 'select',
                inputOptions: {
                    'download': {
                        'download': 'download',
                        'download_as': 'download as'  
                    },
                    'share': {
                        'url': 'url',
                        'email': 'email'
                    },
                    'viewing': {
                        'fullscreen': 'fullscreen',
                        'gallery': 'toggle gallery',
                    },
                    'social': {
                        'load_comments': 'load comments',
                        'comment': 'comment',
                    },
                    'large downloads':{
                        'download_album': 'download album',
                    }
                },
                inputPlaceholder: 'select an option',
                showCancelButton: true,
                required: true,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (value) {
                            this["o_"+value]()
                            resolve()
                        } else {
                            resolve('You need to select something!')
                        }
                    })
                }
            })
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
        nav(i){
            this.set(localStorage.getItem("current")*1+i);
        },
        set(n){
            if(n>=this.images.length){n=0}
            if(n==-1||n<0){n=this.images.length-1}
            localStorage.setItem("current",n);
            this.current=localStorage.getItem("current")-0;
            this.loading=true;
            this.gallery=true;
            this.calbraite_gallery()
            console.log(localStorage.getItem("current")*1)
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
        },
        gallery_distance(distance){
            if(this.images.length+distance<1){distance=this.images.length-distance}
            return JSON.stringify(this.images[this.current+distance])
        },
        calbraite_gallery(){
            this.calbraiting_gallery=true
            this.gallery_distance_n3=this.gallery_distance(-3)
            this.gallery_distance_n2=this.gallery_distance(-2)
            this.gallery_distance_n1=this.gallery_distance(-1)
            this.gallery_distance_p1=this.gallery_distance(1)
            this.gallery_distance_p2=this.gallery_distance(2)
            this.gallery_distance_p3=this.gallery_distance(3)
            this.loading_gallery=[true,true,true,false,true,true,true]
            setTimeout(()=>{this.calbraiting_gallery=false},100)
        }
    },
    data(){
        return {
            options_:{gallery:false},
            current:0,
            images:[],
            loading:true,
            comments:[],
            gallery:true,
            calbraiting_gallery:false,
            gallery_distance_n3:JSON.stringify({url:"",name:""}),
            gallery_distance_n2:JSON.stringify({url:"",name:""}),
            gallery_distance_n1:JSON.stringify({url:"",name:""}),
            gallery_distance_p1:JSON.stringify({url:"",name:""}),
            gallery_distance_p2:JSON.stringify({url:"",name:""}),
            gallery_distance_p3:JSON.stringify({url:"",name:""}),
            loading_gallery:[true,true,true,false,true,true,true],
        }
    },
    mounted(){
        this.images=JSON.parse(this._images);
        this.current=localStorage.getItem("current")-0;
        this.options_=JSON.parse(localStorage.getItem("options"))
        this.calbraite_gallery()
        fetch(`${location.port==8080?"http://":"https://"}${location.port==8080?location.hostname:'pictures-server.aimedtuba.com'}:${location.port==8080?1000:""}/comments?code=${cookies.getCookie('code')}&set=${this.$route.params.set}&album=${this.$route.params.album}`).then(r=>r.json()).then(response=>{
            this.comments=response
        })
        setInterval(()=>{console.log((!this.loading_gallery[0])&&(!this.loading_gallery[1])&&(!this.loading_gallery[2])&&(!this.loading_gallery[3])&&(!this.loading_gallery[4])&&(!this.loading_gallery[5])&&(!this.loading_gallery[6]))},100)
    },
    components:{
        "gallery-item":GalleryItem
    }
}
</script>

<style>
    .root{display: table;}
    .row{display:table-row}
    .column{display:table-cell}
    .column.options{
        width:40px;
        vertical-align:middle;
        text-align:center;
        cursor: pointer;
        font-size:20px;
        color:lightgray;
        border-right:2px solid lightgray;
    }
    .column.options:hover{
        background-color:rgb(250, 250, 250);
        border-radius:3px 0px 0px 3px;
    }
    .root:not(.content) {
        height: calc(97vh - 33px);
        border:2px solid lightgray;
        margin-top: 5px;
        border-radius: 5px;
        width: calc(100% - 3px);
    }
    .row.content.gallery,.column.content.gallery{
        border-top:2px solid lightgray;
        border-radius:5px 5px 0px 0px;
        height:calc(22vh - 33px);
    }
    .column.content:not(.gallery):not(.gallery-item){
        vertical-align: middle;
        height:75vh;
        width:calc(100% - 40px);
        text-align: center;
    }
    .root.content:not(.gallery){
        width:100%;
        height:75vh;
    }
    .content.image{
        max-width:calc(100% - 40px);
        max-height: 60vh;
    }
    .content.title{
        color:gray;
        font-family: 'Roboto', sans-serif;
    }
    .swal2-title, .swal2-validation-message, .swal2-html-container, .roboto-sans-serif{
        font-family: 'Roboto', sans-serif;
    }
    .swal2-html-container{
        text-align: left;
        word-wrap: break-all;
        overflow: auto;
    }
    .column.content.gallery-item{
        width:calc(100vw / 6);
        height:calc(22vh - 33px);
    }
</style>