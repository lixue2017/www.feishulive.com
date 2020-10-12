<template>
  <div class="message">
    <div class="menu" v-if="menuShow">
      <div class="update_name">{{contextMenu.userName}}</div>
      <div v-if="userRole.isOwner && !isMsgRoomAdmin" class="update" :class="{active: roomAction=='setRoom'}" @click="roomAction='setRoom'">任命为房管</div>
      <div v-if="userRole.isOwner && isMsgRoomAdmin" class="update" :class="{active: roomAction=='cancelRoom'}" @click="roomAction='cancelRoom'">取消房管</div>
      <div class="update" :class="{active: roomAction=='muteForever'}" @click="roomAction='muteForever'">永久禁言</div>
      <div class="update" :class="{active: roomAction=='muteAnHour'}" @click="roomAction='muteAnHour'">禁言一小时</div>
      <div class="update_btn" @click="handleRoomAction">确定</div>
      <div class="close el-icon-close" @click="menuShow=false"></div>
    </div>
    <div class="chatroom">
      <div id="dialog" @mouseenter="chat_enter=1" @mouseleave="chat_enter=0">
        <div class="sys_msg">
          <span class="msg_title">系统消息：</span>
          <span class="msg_content">
            飞鼠直播依法对直播内容进行24小时巡查，禁止传播违法违规、封建迷信、暴力血腥、低俗色漆、招嫖诈骗、违禁品等不良信息，坚决维护青少年群体精神文明健康。直播间主播以及用户仅代表个人观点，不代表官方意见，如有问题，请及时与客服联系。
          </span>
        </div>
        <div class="chat_content">
          <div v-for="(item,index) in currentMessageList" :key="index"> 
            <template v-if="textMsg(item.type)&&!giftMsg(json_text(item.payload.data).type)&&!systemMsg(json_text(item.payload.data).type)">
              <div class="level">
                <img src="../../../assets/image/login/ico_level.png" alt="">
                <span>lv{{json_text(item.payload.data).userLevel}}</span>
              </div>
              <div class="anchor_identification" v-if="roomId==json_text(item.payload.data).userId">
                <img :src="require('@/assets/image/detail/anchor_identification.png')" alt="">
              </div>
              <div v-if="json_text(item.payload.data).cmedal">
                <img :src="require('@/assets/image/my/cmedal'+key+'.png')" :title="item.title" alt="" class="cmedal" v-for="(item,key) in haddleCmedal(json_text(item.payload.data).cmedal)" :key="key">
                <!-- <img :src="require('@/assets/image/my/cmedal.png')" alt="" class="cmedal"> -->
              </div>              
              <div class="chat_name" @contextmenu.prevent="handleContextMenu(item)">{{item.nick}}：</div>
              <div class="chat_text">
                  <!-- {{fn(contentList(item.payload.text))}} -->
                <template v-for="(items, indexs) in decodeText(json_text(item.payload.data).sendContent)">
                  <span :key="indexs" class="message-text" v-if="items.name === 'text'" :style="'color:'+item.payload.description">{{ items.text }}</span>
                  <img v-else-if="items.name === 'img'" :src="items.src" width="20px" height="20px" :key="indexs"/>
                </template>
              </div>
            </template>
            <template v-else-if="!shield_tip&&textMsg(item.type)&&giftMsg(json_text(item.payload.data).type)">
              <div class="chat_name giftTip">系统通知：</div>
              <div class="chat_text">{{item.nick+'赠送给主播'+(json_text(item.payload.data).giftName=='荧光棒'?'奶酪':json_text(item.payload.data).giftName)}} <span style="color:#42ebc4">{{json_text(item.payload.data).giftNum?'×'+json_text(item.payload.data).giftNum:''}}</span>  </div>
            </template>
            <template v-else-if="!shield_tip&&textMsg(item.type)&&systemMsg(json_text(item.payload.data).type)">
              <div class="chat_name giftTip">{{json_text(item.payload.data).system_content.split(":")[1]?json_text(item.payload.data).system_content.split(":")[0]:'系统通知'}}：</div>
              <div class="chat_text" style="color: #666;">{{json_text(item.payload.data).system_content.split(":")[1]?json_text(item.payload.data).system_content.split(":")[1]:json_text(item.payload.data).system_content.split(":")[0]}}</div>
            </template>
            <div class="leave" v-else-if="leaveMsg(item.type)">{{item.payload.text}}</div>
            <div class="enter" v-else-if="joinMsg(item.type)">{{item.payload.text}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="send">
      <div class="configure">
        <div class="configure_color">
          <el-popover
          placement="top"
          width="280"
          trigger="click">
          <div class="colorPicker">
            <div :style="'background:'+item" :class="item==currColor?'active':''" v-for="(item, index) in colorMap" :key="index" @click="index?currColor=item:currColor=''"></div>
          </div>
          <img src="../../../assets/image/detail/color.png" slot="reference" title="文字颜色" alt="" width="24px">
        </el-popover>
          <!-- <el-color-picker v-model="color" size="mini"></el-color-picker> -->
        </div>
        <div class="configure_expression">
          <el-popover placement="top" width="400" trigger="click">
              <div class="emojis">
                  <div v-for="item in emojiName" class="emoji" :key="item" @click="chooseEmoji(item)">
                      <img :src="emojiUrl + emojiMap[item]" style="width:30px;height:30px" />
                  </div>
              </div>
              <img src="../../../assets/image/detail/expression.png" slot="reference" title="发表情" alt="" width="24px">
          </el-popover>
        </div>
        <div class="configure_clear" @click="clearDanmu">
          <img src="../../../assets/image/detail/clear.png" title="清除弹幕" alt="" width="24px">
        </div>
        <div class="configure_shield">
          <div class="shield_select">
            <div class="radio" v-if="!shield_effects||!shield_tip"><div></div></div>
            <img src="../../../assets/image/detail/shield.png" alt="" width="24px" v-if="shield_effects&&shield_tip">
            <span>屏蔽特效</span>
          </div>          
          <div class="shield_box">
            <div>
              <div :class="shield_effects?'':'is_no_shield'" @click="shield_effects=!shield_effects">
                <div class="radio"><div></div></div>
                <span>屏蔽礼物特效</span>
              </div>
              <div :class="shield_tip?'':'is_no_shield'" @click="shield_tip=!shield_tip">
                <div class="radio"><div></div></div>
                <span>屏蔽礼物提示</span>
              </div>
            </div>            
          </div>
        </div>
      </div>
      <div class="send_input">
        <el-input
          placeholder=""
          v-model="send_text" v-if="token" :class="send_text?'':'disabled'" @keydown.native="keydownFn($event)">
          <!-- <span slot="suffix" class="search_btn" @click="send()">发送</span> -->
        </el-input>
        <div class="noToken" v-else>
          <div class="MuteStatus"><span @click="login()">登录</span>发弹幕，参与主播互动</div>
        </div>
        <div :class="!token?'ChatSend-button':send_text?'ChatSend-button search_btn':'ChatSend-button search_btn disabled'" @click="send()">发送</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { emojiMap, emojiName, emojiUrl } from '@/utils/emojiMap'
import { decodeText } from '@/utils/decodeText'
import tim_mixin from '@/utils/mixins/tim'
import SVGA from 'svgaplayerweb';
export default {
  mixins: [tim_mixin],
  props: {
    userRole: {
      type: Object,
      default: ()=>{
        return {
          isOwner: false,
          isRoomAdmin: false
        }
      }
    }
  },
  data() {
    return {
      send_text: "",
      color: "#111",
      chat_enter: 0,
      emojiMap: emojiMap,
      emojiName: emojiName,
      emojiUrl: emojiUrl,
      currColor: "",
      colorMap: ['#111', '#2243ad', '#05aad3', '#00da3e', '#a44500', '#116711', '#F44336', '#ce3e50', '#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#0000ff', '#85ffd0'],
      menuShow: false,
      roomAction: '',
      actionUserId: '',
      isMsgRoomAdmin: 0,
      contextMenu: {},
      shield_effects: false,
      shield_tip: false,
      player: null,
      parser: null,
      msgIdList: {},
      svgaQueue: []
    }
  },
  computed: {
    ...mapState('chat',['currentMessageList', 'roomId']),
    ...mapGetters(['token', 'userInfo', 'userLevel'])
  },
  watch: {
    'currentMessageList'(val) {
      this.$nextTick(function(){
        let vcdplayer = document.getElementById("video-container").querySelector(".vcp-player");        
        this.scrollToLocation()
        let lastMsg = val[val.length-1]
        if(this.textMsg(lastMsg.type)) {
          let danmu = this.json_text(lastMsg.payload.data)
          if(!this.shield_effects&&this.giftMsg(danmu.type)){
            danmu.duration = 3000
            this.$giftMessage(danmu)
            if(!vcdplayer) return
            if(danmu.specEffect){
              this.addSvgaQueue(danmu.specEffect)
            }
          } else {            
            if(!vcdplayer) return
            let formatText = this.decodeText(danmu.sendContent)
            danmu.text = formatText
            this.$Danmu(danmu)
          }  
          // if(!this.systemMsg(danmu.type)) {
          //   let formatText = this.decodeText(danmu.sendContent)
          //   danmu.duration = 10000
          //   danmu.text = formatText
          //   this.$Danmu(danmu)
          // }          
        }else if(this.timSystemMsg(lastMsg.type)) {
          if(!vcdplayer) return
          if(lastMsg.payload.userDefinedField) {
            let danmu = this.json_text(lastMsg.payload.userDefinedField)
            if(!this.shield_effects&&this.giftDroadcast(danmu.type)&&!this.msgIdList[danmu.msgId]){
              if(danmu.roomId == this.roomId) return
              this.msgIdList[danmu.msgId] = true
              this.$Droadcast(danmu)
            }else if(danmu.type=="type_send_live") {
              this.$store.commit("chat/SET_ROOM_STATE",danmu.isLive)
            }
          }
          
        }
      })
    }
  },
  methods: {
    decodeText,
    addSvgaQueue(specEffect){
      if(this.svgaQueue.length === 0){
        this.playSvgaAnimation(specEffect)
      }
      this.svgaQueue.unshift(specEffect)
    },
    /**
     * 播放svga动画
     */
    playSvgaAnimation(specEffect){
      if(!this.player) {
        this.player = new SVGA.Player('#svg-animation');
        this.parser = new SVGA.Parser('#svg-animation'); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
      }     
      let arr= specEffect.split(".svga")  
      specEffect = (arr[0]+"_pc.svga").replace("http://sc.feishulive.com/",process.env.VUE_APP_BASE_API)              
      this.parser.load(specEffect, (videoItem)=>{
        this.player.loops = 1
        this.player.setContentMode('AspectFit')
        this.player.setVideoItem(videoItem);
        this.player.startAnimation();
      })
      this.player.onFinished(()=>{
        this.svgaQueue.pop()
        if(this.svgaQueue.length > 0){
          this.playSvgaAnimation(this.svgaQueue[this.svgaQueue.length - 1])
        }
      })
    },
    // 清除弹幕
    clearDanmu() {
      this.$store.commit('chat/CLEAR_CURRENTMESSAGELIST','')
      this.$Danmu.closeAll()     
    },
    myjsonp(URL,callback,callbackname){
			//给系统中创建一个全局变量，叫做callbackname，指向callback函数
			//定义
			window[callbackname] = callback;
			//创建一个script节点
			var oscript = document.createElement("script");
			//和image不一样，设置src并不会发出HTTP请求 
			oscript.src = URL;
			oscript.type = "text/javascript";
			//script标签的请求是在上树的时候发出，请求的是一个函数的执行语句
			document.head.appendChild(oscript);
			//为了不污染页面，瞬间把script拿掉
			document.head.removeChild(oscript);
    },
    // 右键菜单
    handleContextMenu(message) {
      if((this.userRole.isOwner || this.userRole.isRoomAdmin) && message.from!=this.roomId){
        this.contextMenu = this.json_text(message.payload.data)
        if(message.from && this.userId != message.from){
          if(this.userRole.isOwner){
            this.isRoomAdminById(message.from).then((result)=>{
              this.isMsgRoomAdmin = result.isLiveManager
              this.actionUserId = message.from
              this.menuShow = true
            })
          }else{
            this.actionUserId = message.from
            this.menuShow = true
          }
        }
      }
    },
    // 处理勋章
    haddleCmedal(cmedal) {
      cmedal = cmedal.split(",")
      let cmedalList = {}
      let cmedalTitle = ['一掷千金勋章','王者加冕勋章','守护使者勋章']
      cmedal.map((item)=>{
        cmedalList[item] = {}
        cmedalList[item].title = cmedalTitle[item]
      })
      return cmedalList
    },
    /**
     * 房管操作
     */
    handleRoomAction(){
      if(this.roomAction === 'muteAnHour'){
        //禁言一小时
        this.muteAnHour(this.actionUserId).then((res)=>{
          this.roomAction = ''
          this.actionUserId = ''
          this.$message.success('操作成功')
          this.menuShow = false
          this.sendSystem("禁言一小时",0)
        })
      }else if(this.roomAction === 'muteForever'){
        //永久禁言
        this.muteForever(this.actionUserId).then((res)=>{
          this.roomAction = ''
          this.actionUserId = ''
          this.$message.success('操作成功')
          this.menuShow = false
          this.sendSystem("永久禁言",0)
        })
      }else if(this.roomAction === 'setRoom'){
        //设置房管
        this.setRoom(this.actionUserId).then((res)=>{
          this.isMsgRoomAdmin = 0
          this.roomAction = ''
          this.actionUserId = ''
          this.$message.success('操作成功')
          this.menuShow = false
          this.sendSystem("任命为房管",1)
        })
      }else{
        //取消房管
        this.cancelRoomAdmin(this.actionUserId).then((res)=>{
          this.isMsgRoomAdmin = 0
          this.roomAction = ''
          this.actionUserId = ''
          this.$message.success('操作成功')
          this.menuShow = false
          this.sendSystem("取消房管",0)
        })
      }
    },
    login() {
      this.$store.commit('user/DIALOG_SHOW', true);
    },
    chooseEmoji(item) {
      this.send_text += item
    },
    textMsg(type) {
      return type === 'TIMTextElem' || type === 'TIMCustomElem'
    },
    systemMsg(type) {
      return type === 'type_send_system'
    },
    // 腾讯系统消息
    timSystemMsg(type) {
      return type === 'TIMGroupSystemNoticeElem'
    },
    giftMsg(type) {
      return type === 'type_send_gift'
    },
    giftDroadcast(type) {
      return type === 'type_send_gift_all'
    },
    leaveMsg(type) {
      return type === 'Live-Leave'
    },
    joinMsg(type) {
      return type === 'Live-Join'
    },
    json_text(text) {
      return JSON.parse(text)
    },
    keydownFn(e) {
      if(e.keyCode == 13) {
        this.send()
      }
    },
    // 发送系统消息
    sendSystem(msg,type) {
      let sendData = {
        roomId: this.contextMenu.roomId,
        isRoomManner: type+"",
        userLevel: this.contextMenu.userLevel,
        userId: this.contextMenu.userId,
        userName: this.contextMenu.userName,
        system_content: "系统提示:"+this.contextMenu.userName+"已被"+msg,
        type: "type_send_system",
      }
      this.tweblive.sendCustomMessage({
        roomID: this.roomId,
        priority: 'Normal',
        data: JSON.stringify(sendData),
        description: '',
        extension: ''
      }).then((result)=>{
        let message = result.data.message
        message.nick = this.userInfo.nickName
        this.$store.commit('chat/PUSH_CURRENTMESSAGELIST', message)
      })
    },
    // 发送聊天内容
    send() {
      if(!this.send_text.trim()) {
        return
      }
      let sendData = {
        roomId: this.roomId,
        userId: this.userId,
        userName: this.userInfo.nickName,
        cmedal: this.userInfo.cmedal,
        userLevel: this.userLevel.ilevel,
        sendContent: this.send_text,
        type: "type_send_content"
      }
      this.tweblive.sendCustomMessage({
        roomID: this.roomId,
        priority: 'Normal',
        data: JSON.stringify(sendData),
        description: this.currColor,
        extension: 'color'
      }).then((result)=>{
        let message = result.data.message
        message.nick = this.userInfo.nickName
        this.$store.commit('chat/PUSH_CURRENTMESSAGELIST', message)
        this.$store.dispatch('user/getTaskRecord',61);
      }).catch((imError)=>{   
        if(imError.code === 10017){
          this.$message.error('你已被禁言，请联系房管。')
        }
      })
      this.send_text = ""
    },
    scrollToLocation() {
      var mainContainer = document.getElementById("dialog");
      if(!this.chat_enter) {
        if(mainContainer.scrollHeight+300>mainContainer.scrollTop){
          setTimeout(function(){
            mainContainer.scrollTop = mainContainer.scrollHeight+100
          },100)
        }
      }
      }
  },
}
</script>
<style lang="scss">
.emojis {
  height: 160px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  img {
    margin: 0px 5px;
    cursor: pointer;
  }
}
.colorPicker {
  display: flex;
  // justify-content: space-around;
  flex-wrap: wrap;
  padding: 0 5px 10px;
  div {
    width: 30px;
    height: 30px;
    border-radius: 2px;
    margin-top: 10px;
    box-sizing: border-box;
    cursor: pointer;
    &.active {
      border: 2px solid #fff;
      transform: scale(1.1);
      box-shadow: 0 0 1px 1px #101010;
    }
    &:not(:nth-child(7n)) {
      margin-right: 10px;
    }
  }  
}
</style>
<style lang="scss" scoped>
.message {
  position: relative;
  .menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 264px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    z-index: 2;
    text-align: center;
    color: #fff;
    font-size: 14px;
    .update_name {
      font-size: 16px;
      font-weight: 600;
      padding: 19px 0 10px;
    }
    .update {
      border: 2px solid #ffffff;
      border-radius: 20px;
      line-height: 36px;
      width: 200px;
      margin: 6px auto;
      cursor: pointer;
      &.active, &:hover {
        color: #42eec5;
        border-color: #42eec5;
      }
    }
    .update_btn {
      width: 200px;
      background: #42eec5;
      border-radius: 20px;
      line-height: 36px;
      margin: 10px auto 22px;
      cursor: pointer;
    }
    .close { 
      font-size: 24px;
      position: absolute;
      right: 8px;
      top: 8px;
      cursor: pointer;
    }
  }
  display: flex;
  flex-direction: column;
  flex: 1;
  .chatroom {
    position: relative;
    flex: 1;
    background: #f8f8f8;
    border: 1px solid;
    border-color: transparent #e0e0e0 #e0e0e0 #e0e0e0;
    overflow: hidden;
    &>div {
      width: 100%;
      height: 96%;
      box-sizing: border-box;
      margin: 2% 0;
      padding: 0 10px;
      position: absolute;
      top: 0;
      left: 0;
      overflow-y: auto;
      overflow-x: hidden;
      .sys_msg {
        color: #111;
        font-size: 14px;
        line-height: 22px;
        .msg_title {
          color: #007AFF;
        }
      }
      .chat_content {
        font-size: 14px;
        color: #111;
        // overflow: auto;
        &>div {
          display: flex;
          &>div {
            margin-top: 10px;
          }          
          .level {
            height: 22px;
            line-height: 20px;
            background: #57c797;
            border-radius: 5px;
            padding: 0px 6px;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            float: left;
            white-space: nowrap;
            img {
              width: 14px;
              margin-right: 2px;
              vertical-align: middle;
              margin-top: -1px;
            }            
          }
          .cmedal {
            margin-left: 5px;
            margin-right: -5px;
          }
          .anchor_identification {
            margin-left: 5px;
            margin-right: -5px;
          }
          .chat_name {
            color: #007AFF;
            padding-left: 12px;
            cursor: pointer;
            &.giftTip {
              padding-left: 0;
            }
          }
          .chat_text {
            flex: 1;
            line-height: 21px;
            word-wrap: break-word;
            word-break: break-all;
            img {
              vertical-align: middle;
              margin-top: -1px;
            }
          }
          .enter {
            color: #ffa200;
          }
          .leave {
            color: #9E9E9E;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .send {
    height: 100px;
    padding: 8px 10px 10px 10px;
    box-sizing: border-box;
    .configure {
      height: 24px;
      display: flex;
      align-items: center;
      &>div {
        height: 24px;
        img {
          cursor: pointer;
        }        
      }
      .configure_color {
        // margin-top: -4px;
        margin-right: 30px;
      }
      .configure_expression {
        margin-right: 30px;
      }
      .configure_clear {
        flex: 1;
      }
      .configure_shield {
        line-height: 24px;
        position: relative;        
        font-size: 16px;
        &:hover {
          .shield_box {
            display: block;
          }
        }
        .shield_select {
          cursor: pointer;
        }
        img {
          width: 20px;
          vertical-align: middle;
        }
        .radio {
          display: inline-block;
          vertical-align: middle;
          width: 20px;
          height: 20px;
          border: 1px solid #42edc4;
          border-radius: 4px;
          box-sizing: border-box;;
          div {
            width: 10px;
            height: 10px;
            background: #42edc4;
            border-radius: 2px;
            margin: 4px;
          }
        }
        span {
          display: inline-block;
          vertical-align: middle;
          color: #42EBC4;
          font-size: 16px;
          // font-weight: 600;
          padding-left: 5px;
        }
        .shield_box {
          padding-bottom: 35px;
          position: absolute;
          right: 0;
          bottom: 0;
          z-index: 1;
          display: none;
          &>div {
            width: 140px;
            height: 74px;
            text-align: center;
            background: #ffffff;
            overflow: hidden;
            box-shadow: 2px 3px 4px 2px rgba(204, 204, 204, 0.22);
            &>div {
              cursor: pointer;
              margin-top: 10px;
              &.is_no_shield {
                .radio {
                  border-color: #ccc;
                  div {
                    display: none;
                  }
                }
                span {
                  color: #666;
                }
              }
            }
          }          
        }
      }
    }
    .send_input {
      margin-top: 7px;
      display: flex;
      /deep/ input {
        height: 50px;
        flex: 1;
        border-radius: 4px 0 0 4px;
        border-color: #ddd transparent #ddd #ddd;
      }
    }
    .noToken {
      font-size: 14px;
      height: 50px;
      display: flex;
      flex: 1;
      .MuteStatus {
        flex: 1;
        height: 50px;
        line-height: 50px;
        box-sizing: border-box;
        border: 1px solid #ddd;
        color: #919191;
        border-radius: 4px 0 0 4px;
        text-align: center;
        span {
          color: #f70;
          cursor: pointer;
        }
      }
    }
    .ChatSend-button {
      font-size: 14px;
      width: 50px;
      line-height: 50px;
      box-sizing: border-box;
      text-align: center;
      background: #bcc3cf;
      border-radius: 0 4px 4px 0;
      color: #fff;
      cursor: no-drop;
      &.search_btn {
        background: #42EDC4;
        cursor: pointer; 
        &.disabled {
          cursor: no-drop;
          pointer-events: none;
          opacity: 0.8;
        } 
      }
    }
  }
}
</style>