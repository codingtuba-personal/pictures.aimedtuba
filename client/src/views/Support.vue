<template>
  <div>
      <div style="width:100%;text-align:center;" v-if="isMobile()">
          <iframe :src="mobile.src.replace('$start',mobile.start)" class="yt-video mobile" frameborder="0"></iframe>
          <h2 class="chapters-toggle mobile" @click="mobile.chapter=!mobile.chapter">Chapters</h2>
          <div class="chapters mobile" style="display:table;width:100%;text-align:left;">
              <ol>
                    <li v-for="(chapter,index) in mobile.chapters" :key="index" @click="mobile.start=chapter.time" style="color:gray;font-family: 'Roboto', sans-serif;">
                        <a href="javascript:nothing" style="color:gray;font-family: 'Roboto', sans-serif;">{{chapter.name}}</a>
                    </li>
              </ol>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    methods:{
        isMobile(){
            return /iPhone|iPod/i.test(navigator.userAgent)
        }
    },
    data(){
        return{
            mobile:{
                src:"https://www.youtube.com/embed/5PBKb7VQ4DA?controls=0&start=$start&autoplay=1",
                start:0,
                chapter:false,
                chapters:[
                    {name: "Mobile Navigation Guide ", time: 0},
                    {name: "Mobile Guide to Albums", time: 71},
                    {name: "Mobile Options Guide", time: 117},
                    {name: "Download Option", time: 127},
                    {name: "Download as Option", time: 146},
                    {name: "Copy URL Option", time: 174},
                    {name: "Email Option", time: 203},
                    {name: "Fullscreen Option", time: 227},
                    {name: "Gallery Option", time: 237},
                    {name: "View Comments Option", time: 264},
                    {name: "Comment Option", time: 289},
                    {name: "Download Album Option", time: 320},
                    {name: "Mobile Settings Guide", time: 376},
                    {name: "Mobile Extra Features Guide", time: 429},
                    {name: "CSS Fix Feature", time: 439},
                    {name: "Set Navigation List", time: 449},
                    {name: "Non-Existing Sets/Album", time: 463}
                ]
            },
        }
    }
}
</script>

<style>
    .mobile.yt-video {
        width:calc(100vw - 17px);
        margin-top:5px;
        height:calc(100vw * 0.53);
    }
    .mobile.chapters-toggle {
        color:gray;
        cursor:pointer;
        font-family: 'Roboto', sans-serif;
        margin: 0 auto;
    }

</style>