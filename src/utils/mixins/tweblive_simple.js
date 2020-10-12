import TWebLive from 'tweblive'
import Vue from 'vue'
import Controls from '@/components/controls.vue';
let ControlsConstructor = Vue.extend(Controls);
export default {
  data(){
    return {
      tweblive: null,
      controlsInstance: null,
      clarityLabel: {od: '高清'},
      controlsShowTimer: null,
      timer: 0,
      isRecord: 0
    }
  },
  watch: {    
    onAdvert(val) {
      let roomInfo = this.recommend.rotationList[val]
      if(!this.tweblive) {
        if(roomInfo.highClear) {
          this.options.flv = roomInfo.highClear
        }else {
          this.options.flv = roomInfo.pullUrl
        }
        if(roomInfo.standardClear) {
          this.options.flv_hd = roomInfo.standardClear        
          this.clarityLabel.hd = "标清"
        }
        if(roomInfo.fluent) {
          this.options.flv_sd = roomInfo.fluent       
          this.clarityLabel.sd = "流畅"
        }  
        this.initTwebLive()
        return
      }
      this.tweblive.load(roomInfo.pullUrl)
      if(this.tweblive._player.el.querySelector(".mask")) {
        this.tweblive._player.el.querySelector(".mask").remove()
      }
    },
    domID(val) {
      if(val) {
        let roomInfo = this.roomInfo
        if(roomInfo.highClear) {
          this.options.flv = roomInfo.highClear
        }else {
          this.options.flv = roomInfo.pullUrl
        }
        if(roomInfo.standardClear) {
          this.options.flv_hd = roomInfo.standardClear        
          this.clarityLabel.hd = "标清"
        }
        if(roomInfo.fluent) {
          this.options.flv_sd = roomInfo.fluent       
          this.clarityLabel.sd = "流畅"
        }  
        this.options.poster = roomInfo.imgUrl?roomInfo.imgUrl:require('@/assets/image/default_cover.png')
        this.initTwebLive()
      }else {
        this.tweblive = null
      }      
    }
  },
  methods: {    
    //初始化腾讯云Web直播互动组件TWebLive
    initTwebLive() {
      //实例化TWebLive
      let options = {
        SDKAppID: this.sdkAppID,
        domID: this.domID,
        ...this.options
      }
      this.tweblive = new TWebLive(options)
      this.$nextTick(function() {
        if(this.muted) {
          this.tweblive._player.mute(true)
          this.tweblive.play()
        }
        //插入自定义工具栏
        if(this.controls) {
          this.insertTool()
          let player = this.tweblive._player.el
          let enter = document.createElement("div")
          enter.setAttribute("class", "enter-outer")
          enter.innerHTML = "<div class='enter'><laber>进入直播间</laber></div>"
          player.appendChild(enter)
          enter.onclick = this.toRoom
          //自动播放
          this.autoPlay() 
        }            
      })
    },  
    // 点击进入直播间
    toRoom() {
      window.open("/#/live/detail/"+this.recommend.rotationList[this.onAdvert].roomId)
    },  
    // 插入自定义工具栏
    togglePlay() {
      this.tweblive._player.togglePlay()
    },
    setVolume(val) {
      this.tweblive._player.volume(val/100)
    },
    switchClarity(type) {
      this.tweblive._player.switchClarity(type)
    },
    toggleFullscreen() {
      let player = this.tweblive._player
      if(player.fullscreen()) {
        player.fullscreen(false)
      }else {
        player.fullscreen(true)
      }
    },
    controlsShow() {
      if(this.controlsShowTimer) {
        clearTimeout(this.controlsShowTimer) 
      }          
      this.controlsInstance.controlsShow = true
    },
    controlsHide() {
      let player = this.tweblive._player
      if(!player.playing()) return      
      this.controlsShowTimer = setTimeout(() => {
        this.controlsInstance.controlsShow = false
      }, 3000);
    },
    insertTool() {
      this.$el.querySelector(".vcp-player").onmouseenter=this.controlsShow
      this.$el.querySelector(".vcp-player").onmouseleave=this.controlsHide
      this.controlsInstance = new ControlsConstructor({
        data: {
          togglePlay: this.togglePlay,
          setVolume: this.setVolume,
          toggleFullscreen: this.toggleFullscreen,
          clarityLabel: this.clarityLabel,
          switchClarity: this.switchClarity,
          noChat: true
        }
      })
      this.controlsInstance.$mount();
      this.$el.querySelector(".vcp-player").appendChild(this.controlsInstance.$el);
    },
    //自动播放
    autoPlay(){
      let player = this.tweblive._player.el  
      let promise= player.querySelector("video").play()
      promise.catch(error => {
        // Auto-play was prevented
        // Show a UI element to let the user manually start playback
        let mask = document.createElement("div")
        mask.setAttribute("class", "mask")
        mask.innerHTML = "<div class='autoPlayImg'></div>"
        player.appendChild(mask)
        mask.onclick = (() => {
          mask.remove()
          this.tweblive.play()
        })
      })
    }
  }
}