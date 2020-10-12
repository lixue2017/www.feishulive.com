import TWebLive from 'tweblive'
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import tim_mixin from '@/utils/mixins/tim'
import Controls from '@/components/controls.vue';
let ControlsConstructor = Vue.extend(Controls);
export default {
  mixins: [tim_mixin],
  data(){
    return {
      options: {
        flv: "",
        m3u8: '',
        autoplay: true,
        width: '100%',
        height: 'auto',
        poster: {style:'cover', src: ''},
        controls: 'none',
        pausePosterEnabled: false,
        clarityLabel: {od: '超清', hd: '高清', sd: '标清'},
        wording: {
          1:'主播不在，先在直播间聊聊天吧~ ',
          2:'主播不在，先在直播间聊聊天吧~ ',
          4:'主播不在，先在直播间聊聊天吧~ ',
          13:'您观看的直播已结束',
          2032: '请求视频失败，请检查网络',
          2048: '请求m3u8文件失败，可能是网络错误或者跨域问题'
        }
      },
      roomData: {
        userId: null,
        userName: null,
        cmedal: null,
        userLevel: null
      },
      tweblive: null,
      isJoined: false,
      userRole: {
        isOwner: false,
        isRoomAdmin: false
      },
      controlsInstance: null,
      clarityLabel: {od: '高清'},
      controlsShowTimer: null,
      timer: 0,
      isRecord: 0
    }
  },
  computed: {
    ...mapState('chat',[
      'sdkAppID', 
      'roomId', 
      'imUserInfo', 
      'isSDKReady',
      'currentMessageList',
      'isLive'
    ]),
    ...mapGetters(['token', 'task', 'userInfo', 'userLevel'])
  },
  watch:{
    imUserInfo: {
      handler(newValue, oldValue){
        //调用 TIM SDK 登录接口
        if(newValue.userId){ 
          if(oldValue.userId) {
            this.logout()
          }else {
            // 退出游客身份
            this.exitRoom()
          }                   
        }else{
          this.logout()
        }
      },
      deep: true
    },
    token() {
      this.taskRecord()
    },
    userInfo(val) {
      if(this.controlsInstance) {
        this.controlsInstance.roomData.userId = val.userId
        this.controlsInstance.roomData.userName = val.nickName
        this.controlsInstance.roomData.cmedal = val.cmedal
      }      
    },
    userLevel(val) {
      if(this.controlsInstance) {
        this.controlsInstance.roomData.userLevel = val.ilevel
      }   
    },
    isLive(val) {
      if(val) {
        this.initTwebLive(val)
      }else {
        document.getElementById("video-container").innerHTML = '<div class="down-player"><div class="down-player-title">主播暂不在播哦～</div><div class="down-player-bottom"><div class="down-player-face"><img src="'+this.roomInfo.headImg+'" alt=""></div><div class="down-player-date"><p>上次直播时间：</p><p>'+this.roomInfo.lastdate+'</p></div></div></div>'
      }
    }
  },
  created() {
    //获取直播间Id
    this.$store.commit('chat/SET_ROOMID', this.$route.params.id)
  },
  mounted() {
    if(!this.imUserInfo.userId&&!this.token) {
      this.$store.dispatch("user/getVisitorSig")
    }
    window._that = this
    this.getLiveRoomInfo().then(()=>{
      if(this.roomInfo.highClear) {
        this.options.flv = this.roomInfo.highClear
      }else {
        this.options.flv = this.roomInfo.pullUrl
      }
      if(this.roomInfo.standardClear) {
        this.options.flv_hd = this.roomInfo.standardClear        
        this.clarityLabel.hd = "标清"
      }
      if(this.roomInfo.fluent) {
        this.options.flv_sd = this.roomInfo.fluent       
        this.clarityLabel.sd = "流畅"
      }  
      this.initTwebLive(this.roomInfo.istate)
      // this.initTwebLive(0)
    })
    window.onbeforeunload = this.logout
  },
  methods: {
    //初始化腾讯云Web直播互动组件TWebLive
    initTwebLive(istate) {
      //实例化TWebLive
      let options = {
        SDKAppID: this.sdkAppID,
        // domID: 'video-container',
        ...this.options
      }
      if(istate) {
        options.domID = 'video-container'
      }
      this.tweblive = new TWebLive(options)
      Vue.prototype.tweblive = this.tweblive
      if(!this.imUserInfo.userId) {
        this.enterRoom()
      }else {
        this.imLogin()
      } 
      if(istate) {
        this.$nextTick(function() {
          //插入自定义工具栏
          this.insertTool()
          
          //插入弹幕
          // this.insertDanmu()
          
          let vcdplayer = this.$el.querySelector(".vcp-player");
          let svgContiner = document.createElement('div')
          svgContiner.id = 'svg-animation'
          svgContiner.setAttribute("class", "danmu");
          svgContiner.style.zIndex = 1001
          vcdplayer.appendChild(svgContiner)
          //自动播放
          this.autoPlay()  
          this.taskRecord()        
        })
      }
      // 播放器进入播放状态时触发 
      this.tweblive.on(TWebLive.EVENT.PLAYING, this.onPlayerPlaying);
      // 播放器暂停时触发 
      this.tweblive.on(TWebLive.EVENT.PAUSE, this.onPlayerPause);     

      // 登录成功后会触发 SDK_READY 事件，该事件触发后，可正常使用 SDK 接口
      this.tweblive.on(TWebLive.EVENT.IM_READY, this.onReadyStateUpdate)
      // 被踢出
      this.tweblive.on(TWebLive.EVENT.KICKED_OUT, this.onKickedOut)
      // SDK内部出错
      this.tweblive.on(TWebLive.EVENT.ERROR, this.onError)
      // // 收到系统新消息
      // this.tweblive.on(TWebLive.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, this.onGroupSystemNoticeReceived)
      this.tweblive._tim.on('receiveGroupSystemNotice', this.onGroupSystemNoticeReceived)
      // // 收到自定义新消息
      this.tweblive.on(TWebLive.EVENT.CUSTOM_MESSAGE_RECEIVED, this.onCustomMessageReceived)
      // 收到文本新消息
      this.tweblive.on(TWebLive.EVENT.TEXT_MESSAGE_RECEIVED, this.onTextMessageReceived)
      // 加入直播间
      // this.tweblive.on(TWebLive.EVENT.REMOTE_USER_JOIN, this.onRemoteUserJoin)
      // 离开直播间
      // this.tweblive.on(TWebLive.EVENT.REMOTE_USER_LEAVE, this.onRemoteUserLeave)
      // 网络监测
      this.tweblive.on(TWebLive.EVENT.NET_STATE_CHANGE, this.onNetStateChange)
      // 推流结束
      this.tweblive.on(TWebLive.EVENT.ENDED, this.onLiveEnd)
    },
    // 视频播放
    onPlayerPlaying() {
      let danmu_switch = this.$el.querySelector(".vcp-danmu-switch[data-type='1']")
      if(danmu_switch) {
        this.$Danmu.switch(true);
      }
    },
    // 视频暂停
    onPlayerPause() {
      // this.$Danmu.switch(false);
    },
    // 观看10分钟记录
    taskRecord() {
      if(this.timer) clearTimeout(this.timer)
      if(this.token&&!this.isRecord) {
        this.timer = setTimeout(()=>{
          this.isRecord = 1
          if(this.task.dayArr[4]&&!this.task.dayArr[4].receive) {
            this.$store.dispatch('user/getTaskRecord',64);
          }          
        },60000)
      }  
    },
    /**
     * 获取用户角色
     */
    getUserRole(){
      Promise.all([this.isGroupLeader(),this.isRoomAdmin()]).then((result)=>{
        //是否为群主
        this.userRole.isOwner = result[0].isOwner
        //是否为房管
        this.userRole.isRoomAdmin = result[1].isLiveManager
      })
    },
    //登录腾讯im
    imLogin(){
      this.tweblive.login({
        userID: this.imUserInfo.userId, 
        userSig: this.imUserInfo.userSig
      })
    },
    //加入直播间
    enterRoom(){
      return this.tweblive.enterRoom(this.roomId).then(()=>{
        this.isJoined = true
        if(this.userInfo.nickName) {
          this.tweblive.setMyProfile({
            nick: this.userInfo.nickName
          })
        }
      }).catch((imError)=>{
        if(imError.code === 10007 || imError.code === 10015){
          this.$message.error('你加入的直播间不存在哦~')
        }
      })
    },
    //退出直播间
    exitRoom(){      
      this.tweblive.exitRoom(this.roomId).then(() => {
        this.isJoined = false
      })
    },
    //退出tweblive
    twebliveLogout(){
      this.tweblive.logout().then(() => {
        if(!this.token) {
          // this.$message.success('退出成功')
        }        
      })
    },
    //已用户身份退出直播间，已游客身份进入直播间
    async logout(){
      if(this.roomId!=this.userInfo.userId){
        //退出直播间
        await this.exitRoom()
      }      
      //退出tweblive，不允许聊天
      await this.twebliveLogout()
      
      //登录用户身份
      this.imLogin()
      //已游客身份进入直播间
      // this.enterRoom()
      // 重新获取游客信息
      // this.$store.dispatch("user/getVisitorSig")
    },
    //登录成功后触发 TWebLive.EVENT.IM_READY
    onReadyStateUpdate({ name }){
      const isSDKReady = name === TWebLive.EVENT.IM_READY ? true : false
      this.$store.commit('chat/TOGGLE_ISSDKREADY', isSDKReady)
      if(isSDKReady){
        this.enterRoom().then(()=>{
          if(!this.token) return
          this.getUserRole()
        })
      }
    },
    //被踢出 TWebLive.EVENT.KICKED_OUT
    onKickedOut(event){
      let message = ''
      switch (event.data.type) {
        case this.TWebLive.TYPES.KICKED_OUT_MULT_ACCOUNT:
          message = '由于多实例登录'
          break
        case this.TWebLive.TYPES.KICKED_OUT_MULT_DEVICE:
          message = '由于多设备登录'
          break
        case this.TWebLive.TYPES.KICKED_OUT_USERSIG_EXPIRED:
          message = '由于 userSig 过期'
          break
        default:
          break
      }
      this.$message.error(`${message}被踢出，请重新登录。`)
    },
    //SDK内部出错 TWebLive.EVENT.ERROR
    onError({ data }){
      this.$message.error(data.message)
    },
    onGroupSystemNoticeReceived({ data: messageList }){
      messageList.message.nick = messageList.message.nick || messageList.message.from
      messageList=[messageList.message]
      // messageList.forEach((message)=> {
      //   messageList.message.nick = messageList.message.nick || messageList.message.from
      // })
      this.$store.commit('chat/PUSH_CURRENTMESSAGELIST', messageList)
    },
    //收到自定义新消息 TWebLive.EVENT.CUSTOM_MESSAGE_RECEIVED
    onCustomMessageReceived({ data: messageList }){
      messageList.forEach((message)=> {
        message.nick = message.nick || message.from
      })
      this.$store.commit('chat/PUSH_CURRENTMESSAGELIST', messageList)
    },
    //收到文本新消息 TWebLive.EVENT.TEXT_MESSAGE_RECEIVED
    onTextMessageReceived({ data: messageList }){
      messageList.forEach((message)=> {
        const userName = message.nick || message.from
        message.nick = userName
      })
      this.$store.commit('chat/PUSH_CURRENTMESSAGELIST', messageList)
    },
    //加入直播间 TWebLive.EVENT.REMOTE_USER_JOIN
    onRemoteUserJoin({ data: messageList }){      
      messageList.forEach((message) => {
        if(message.payload.operatorID==this.roomId) return
        const userName = message.nick || message.payload.userIDList[0]
        message.payload.text = `欢迎 ${userName} 进入直播间 `
        message.type = 'Live-Join'
      })
      if (this.isSDKReady) {
        this.$store.commit('chat/PUSH_CURRENTMESSAGELIST', messageList)
      }
    },
    //离开直播间 TWebLive.EVENT.REMOTE_USER_LEAVE
    onRemoteUserLeave({ data: messageList }){
      messageList.forEach(function(message) {
        const userName = message.nick || message.payload.userIDList[0]
        message.payload.text = `${userName} 离开了直播间`
        message.type = 'Live-Leave'
      })
      this.$store.commit('chat/PUSH_CURRENTMESSAGELIST', messageList)
    },
    //网络监测 TWebLive.EVENT.NET_STATE_CHANGE
    onNetStateChange(event){
      let state = event.data
      switch (state) {
        case this.TWebLive.TYPES.NET_STATE_CONNECTED:
          this.$message.success('已接入网络')
          break
        case this.TWebLive.TYPES.NET_STATE_CONNECTING:
          this.$message.warning('当前网络不稳定')
          break
        case this.TWebLive.TYPES.NET_STATE_DISCONNECTED:
          this.$message.error('当前网络不可用')
          break
        default:
          break
      }
    },
    //推流结束 TWebLive.EVENT.ENDED
    onLiveEnd(){
      this.$message.warning('直播已结束')
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
          roomId: this.roomId,
          commit: this.$store.commit,
          dispatch: this.$store.dispatch        
        }
      })
      this.controlsInstance.$mount();
      this.$el.querySelector(".vcp-player").appendChild(this.controlsInstance.$el);
      this.controlsInstance.roomData = {
        userId: this.userInfo.userId,
        userName: this.userInfo.nickName,
        cmedal: this.userInfo.cmedal,
        userLevel: this.userLevel.ilevel
      }
    },
    //插入弹幕
    insertDanmu(){
      let controls = this.$el.querySelector(".vcp-player .vcp-controls-panel")
      let danmu_switch = document.createElement("div")
      danmu_switch.setAttribute("class", "vcp-danmu-switch")
      danmu_switch.setAttribute("data-type", "1")
      danmu_switch.innerHTML = "<span>弹幕</span><div></div>"
      controls.appendChild(danmu_switch)
      danmu_switch.onclick = this.danmuSwitchFn
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
  },
  //导航离开该组件的对应路由时调用
  async beforeRouteLeave (to, from, next) {
    //退出直播间
    await this.exitRoom()
    next()
  }
}