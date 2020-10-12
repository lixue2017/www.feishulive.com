import { getIMUser } from '@/utils/auth'

const state = {
  isSDKReady: false, // TIM SDK 是否 ready
  //当前聊天消息列表
  currentMessageList: [],
  currentLiveTips: [],
  //即时通讯IM应用SDKAppID
  sdkAppID: 1400309160,
  //直播间Id
  roomId: '',
  //im用户登录
  imUserInfo:  getIMUser(),
  likeCount: 0, //点赞人数
  isLive: 1
}

const mutations = {
  TOGGLE_ISSDKREADY(state, data) {
    state.isSDKReady = typeof data === 'undefined' ? !state.isSDKReady : data
  },
  SET_ROOMID(state, data){
    state.roomId = data
  },
  SET_IMUSERINFO(state, data){
    state.imUserInfo = {
      userId: data.userid,
      userSig: data.userSig
    }
  },  
  showLike(state, data){
    state.likeCount += data
  },
  PUSH_CURRENTMESSAGELIST(state, data){
    if (Array.isArray(data)) {
      state.currentMessageList = [...state.currentMessageList, ...data]
    } else  {
      state.currentMessageList = [...state.currentMessageList, data]
    }
  },
  CLEAR_CURRENTMESSAGELIST(state){
    state.currentMessageList = []
  },
  pushCurrentTipsList(state, data){
    let timer = null
    if (Array.isArray(data)) {
      state.currentLiveTips = [...state.currentLiveTips, ...data]
    } else  {
      state.currentLiveTips = [...state.currentLiveTips, data]
    }
    timer = setTimeout(()=>{
      state.currentLiveTips.shift()
    },2000)
    if (state.currentLiveTips.length ===0) {
      clearTimeout(timer)
    }
  },
  SET_ROOM_STATE(state, data) {
    state.isLive = parseInt(data)
  }
}

const actions = { 

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}