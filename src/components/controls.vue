<template>
  <div :class="!controlsShow?'vcp-controls-panel hide':'vcp-controls-panel show'" >
    <div class="vcp-panel-bg"></div>
    <div class="vcp-playtoggle" @click="togglePlay"></div>
    <div class="vcp-refresh" @click="switch_clarity(current)"></div>
    <!-- <span class="vcp-timelabel"></span>
    <div class="vcp-timeline" style="display: none;">
      <div class="vcp-slider">
        <div class="vcp-slider-track"></div>
        <div class="vcp-slider-thumb"></div>
      </div>
    </div> -->
    <div class="danmu_box" v-if="!noChat">
      <el-input v-model="send_text" @keydown.native="keydownFn($event)" :placeholder="roomData.userId?'':'你还没登录，请先登录'" :disabled="!roomData.userId">
        <span slot="suffix" class="danmu_btn" @click="send()">发送</span>
      </el-input>
    </div>
    <div class="vcp-fullscreen-toggle" @click="toggleFullscreen"></div>
    <div class="vcp-danmu-switch" :data-type="danmuSwitch" @click="danmuSwitchFn" v-if="!noChat">
      <span>弹幕</span>
      <div></div>
    </div>
    <div class="vcp-clarityswitcher">
      <a class="vcp-vertical-switcher-current">{{clarityLabel[current]}}</a>
      <div class="vcp-vertical-switcher-container">
        <a :class="current==key?'vcp-vertical-switcher-item current':'vcp-vertical-switcher-item'" :data-def="key" v-for="(item,key) in clarityLabel" :key="key" @click="switch_clarity(key)">{{item}}</a>
      </div>
    </div>
    <div :class="volume?'vcp-volume':'vcp-volume vcp-volume-muted'">
      <span class="vcp-volume-icon" @click="toggleVolume"></span>
      <el-slider v-model="volume" :format-tooltip="formatTooltip" @input="setVolume"></el-slider>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      volume: 50,
      minVolume: 50,
      danmuSwitch: 1,
      current: 'od',
      controlsShow: false,
      send_text: "",
      noChat: null,
      roomData: {
        userId: null,
        userName: null,
        cmedal: null,
        userLevel: null
      }
    }
  },
  watch: {
    volume(val) {
      if(val>0) {
        this.minVolume = val
      }
    }
  },
  mounted() {
    console.log(this.tweblive)
  },
  methods: {
    keydownFn(e) {
      if(e.keyCode == 13) {
        this.send()
      }
    },
    // 发送聊天内容
    send() {
      if(!this.send_text.trim()&&!this.userId) {
        return
      }
      let sendData = {
        roomId: this.roomId,
        userId: this.roomData.userId,
        userName: this.roomData.userName,
        cmedal: this.roomData.cmedal,
        userLevel: this.roomData.userLevel,
        sendContent: this.send_text,
        type: "type_send_content"
      }
      this.tweblive.sendCustomMessage({
        roomID: this.roomId,
        priority: 'Normal',
        data: JSON.stringify(sendData),
        description: '',
        extension: ''
      }).then((result)=>{
        let message = result.data.message
        message.nick = this.roomData.userName
        this.commit('chat/PUSH_CURRENTMESSAGELIST', message)
        this.dispatch('user/getTaskRecord',61);
      }).catch((imError)=>{   
        if(imError.code === 10017){
          this.$message.error('你已被禁言，请联系房管。')
        }
      })
      this.send_text = ""
    },
    danmuSwitchFn() {
      if (this.danmuSwitch == 1) {
        this.danmuSwitch = 0
        this.$Danmu.switch(false);
      } else {
        this.danmuSwitch = 1
        this.$Danmu.switch(true);
      }
    },
    toggleVolume() {            
      if(this.volume) {
        this.volume = 0
        this.setVolume(0)
      }else {
        this.volume = this.minVolume
        this.setVolume(this.minVolume)
      }
    },
    switch_clarity(key) {
      this.current = key
      this.switchClarity(key)
    },
    formatTooltip(val) {
      return '音量'+val+'%'
    }
  }
};
</script>

<style lang="scss">
.vcp-player {
  &.vcp-playing {
    .vcp-playtoggle {
      background-image: url('../assets/image/detail/play.png');
    }
    /deep/ .mask {
      display: none;
    }
  }
  &.vcp-fullscreen {
    .vcp-fullscreen-toggle {
      background-image: url('../assets/image/detail/nofullscreen.png');
    }
    /deep/ .danmu_box {
      display: block;
    }
  }
  .vcp-playtoggle {
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../assets/image/detail/pause.png');
  }
  .vcp-refresh {
    cursor: pointer;
    position: relative;
    z-index: 1001;
    width: 3em;
    height: 100%;
    float: left;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../assets/image/detail/refresh.png');
  }
  /deep/ .danmu_box {
    float: left;
    z-index: 1001;
    position: relative;
    margin: 8px 0 7px 30px;    
    display: none;
    input {
      height: 33px;
      width: 300px;
      border-radius: 20px;
    }
    .el-input__suffix {
      height: 33px;
      line-height: 33px;
      right: 0;
      padding: 0 20px;
      background: #42EDC4;
      border-radius: 0 20px 20px 0;
      color: #fff;
      cursor: pointer;
    }
  }
  .vcp-volume{
    width: 12em;
    .vcp-volume-icon {
      width: 4em;
      top: -1px;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url('../assets/image/detail/volume.png');
    }
    &.vcp-volume-muted {
      .vcp-volume-icon {
        background-image: url('../assets/image/detail/mute.png');
      }
    }
    /deep/ .el-slider {
      width: 8em;
      .el-slider__runway {
        margin: 21px 0 21px 58px;
      }
      .el-slider__button-wrapper {
        cursor: pointer;
        .el-slider__button {
          width: 10px;
          height: 10px;
          cursor: pointer;
        }
      }
      
    }
  }
  .vcp-clarityswitcher {
    .vcp-vertical-switcher-container {
      display: none;
    }
    &:hover {
      .vcp-vertical-switcher-container {
        display: block;
      }
    }
  }
  .vcp-clarityswitcher {
    width: auto;
    height: auto;
    font-size: 14px;
    margin-left: 25px;
    top: 50%;
    transform: translateY(-50%);
    a:not(.current):hover, a.current {
      color: #42EBC4;
    }
    .vcp-vertical-switcher-current {
      height: 26px;
      line-height: 26px;
      padding: 0 21px;
      background: #444444;
      border-radius: 13px;
    }
    .vcp-vertical-switcher-container {
      width: 70px;
      bottom: 0;
      background: transparent;
      padding-bottom: 35px;
      // &::before {
      //   content: '';
      //   border: 5px solid;
      //   border-color: transparent #242424 #242424 transparent;
      //   position: absolute;
      //   bottom: 30px;
      //   left: 50%;
      //   transform: translateX(-50%) rotateZ(45deg) skew(10deg, 10deg);
      // }
      .vcp-vertical-switcher-item {
        background: #242424;
      }
    }
  }
  .vcp-danmu-switch {
    height: 26px;
    line-height: 26px;
    font-size: 14px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    float: right;
    background: #444444;
    border-radius: 13px;
    padding-left: 13px;
    padding-right: 32px;
    color: #42ebc4;
    margin-left: 18px;
    margin-right: 26px;
    z-index: 1001;
    cursor: pointer;
    &[data-type="0"] {
      padding-left: 32px;
      padding-right: 13px;
      color: #fff;
      div {
        left: 6px;
        right: auto;
        background: #999;
        &::before {
          background: rgba(153, 153, 153, 0.4);
        }
      }
    }
    div {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #42ebc4;
      position: absolute;
      top: 5px;
      right: 6px;
      // box-shadow: 1px 1px 1px 1px rgba(66,235,196, 0.4);
      &::before {
        content: "";
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(66, 235, 196, 0.4);
        position: absolute;
        left: -2px;
        top: -2px;
      }
    }
  }
  .vcp-fullscreen-toggle {
    margin-right: 10px;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('../assets/image/detail/fullscreen.png');
  }
}

</style>