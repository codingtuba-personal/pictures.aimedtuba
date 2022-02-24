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
      <div style="width:calc(100% - 3px);display:table;margin-top:5px;border:lightgray 2px solid;border-radius:5px" v-else>
          <div style="width:calc(100% - 3px);display:table-row" class="desktop-row">
              <div class="desktop-cell desktop-chapters" @click="chapters()" style="width:30px;display:table-cell;height:calc(97vh - 33px);color:lightgray;font-family: 'Roboto', sans-serif;vertical-align:middle;text-align:center;border-radius:5px;border-right:lightgray 2px solid;cursor:pointer">
                  C<br>h<br>a<br>p<br>t<br>e<br>r<br>s
              </div>
              <div class="desktop-cell desktop-video" style="width:calc(100% - 33px);display:table-cell;height:calc(97vh - 33px);align-items:center;text-align: center;vertical-align:middle">
                  <iframe :src="desktop.src.replace('$start',desktop.start)" class="yt-video desktop" frameborder="0"></iframe>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
    methods:{
        isMobile(){
            return /iPhone|iPod/i.test(navigator.userAgent)
        },
        chapters(){
            this.$swal({
                title: 'Chapters',
                input:'select',
                inputOptions:this.desktop.chapters.map(chapter=>{
                    return chapter.name+" ("+this.secondsToMs(chapter.time)+")"
                }),
                inputPlaceholder: 'Select chapter',
                showCancelButton: true,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (value) {
                            this.desktop.start=this.desktop.chapters[value].time
                            resolve()
                        } else {
                            resolve('You need to select a chapter')
                        }
                    })
                }
            })
        },
        msToSeconds(ms){return ms.split(":")[0]*60+ms.split(":")[1]*1},
        secondsToMs(seconds){return Math.floor(seconds/60)+":"+(seconds%60<10?"0":"")+seconds%60},
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
            desktop:{
                src:"https://www.youtube.com/embed/yCYyvKCW3M4?controls=0&start=$start&autoplay=1",
                start:0,
                chapters:[
                    {name: "Desktop Home Page Navigation Guide", time:0},
                    {name: "Album Navigation Guide For Desktop", time:47},
                    {name: "Full Option Guide to Desktop", time:this.msToSeconds("1:33")},
                    {name: "Download Option", time: this.msToSeconds("1:47")},
                    {name: "Download as Option", time: this.msToSeconds("2:22")},
                    {name: "Copy URL Option", time: this.msToSeconds("2:50")},
                    {name: "Email Option", time: this.msToSeconds("3:20")},
                    {name: "Fullscreen Option", time: this.msToSeconds("4:47")},
                    {name: "Gallery Option", time: this.msToSeconds("5:05")},
                    {name: "View Comments Option", time: this.msToSeconds("5:34")},
                    {name: "Comment Option", time: this.msToSeconds("5:54")},
                    {name: "Deleting Comments: How To", time: this.msToSeconds("6:44")},
                    {name: "Donwload Album Option", time: this.msToSeconds("7:27")},
                    {name: "Settings Navigation Guide For Desktop", time: this.msToSeconds("8:40")},
                ]
            }
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
    .desktop-cell.desktop-chapters:hover{
        background-color:rgb(250, 250, 250);
    }
    .yt-video.desktop{
        width:calc(100% - 17px);
        height:calc(100vw * 0.53);
        max-height: calc(100vh - 40px);
    }
</style>