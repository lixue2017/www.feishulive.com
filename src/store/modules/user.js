import { apiRegister, apiPassword, apiLogin, apiPhoneLoginYZM, apiUserDetail, apiVisitorSig } from '@/api/base'
import { apiUserLevel, apiSearchAnchorState } from '@/api/user'
import { getToken, setToken, removeToken, setIMUser, removeIMUser } from '@/utils/auth'
import { apiTaskCenterList, apiTaskRecord, apiGetTask } from '@/api/live'
const state = {
  token: getToken(),
  apiUserArr: [],
  userDialog: 3,
  apiUser: {},
  dialogStauts: false,
  userInfo: {},
  userLevel: {},
  rechargeStauts: false,
  applyStep: 0, // 1.待审核 2.审核通过 3.未通过 4.未提交过资料
  task: {
    newArr: [],
    dayArr: [],
    kingArr: []
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  GET_API: (state) => {
    state.apiUserArr = [apiRegister, apiPassword, apiLogin, apiPhoneLoginYZM];
    state.apiUser = state.apiUserArr[state.userDialog-1];
  },
  DIALOG_SHOW: (state, stauts) => {
    state.dialogStauts = stauts
  },
  DIALOG_TAB: (state, stauts) => {
    state.userDialog = stauts
  },
  RECHARGE_SHOW: (state, stauts) => {
    state.rechargeStauts = stauts
  },
  SET_USERINFO: (state, data) => {
    state.userInfo = data
  },
  SET_USER_HEAD: (state, data) => {
    state.userInfo.head = data
  },
  SET_LEVEL: (state, data) => {
    state.userLevel = data
  },
  SET_USERINFOBYKEY: (state, { key, value })=>{
    state.userInfo[key] = value
  },
  SET_APPLYSTEP: (state, data) => {
    state.applyStep = data
  },
  SET_TASK: (state, data) => {
    state.task[data.key] = data.res
  },
}

const actions = {
  // user login
  login({ dispatch, commit,state }, userInfo){
    return new Promise((resolve, reject) => {
      let params = userInfo
      commit('GET_API')
      state.apiUser(params).then(data => {
        commit('chat/SET_IMUSERINFO', data, {root: true})
        setIMUser({userId: data.userid, userSig: data.userSig})
        commit('SET_TOKEN', data.token)
        commit('DIALOG_SHOW', false)
        setToken(data.token)
        dispatch('getUserInfoAction')
        dispatch('getAnchorState')
        dispatch("getUserLevel")
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 忘记密码
  forgotPwd({commit}, userInfo) {
    return new Promise((resolve, reject) => {
      let params = userInfo
      commit('GET_API')
      state.apiUser(params).then(data => {
        commit('DIALOG_TAB', 3);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取游客im身份
  getVisitorSig({ commit }) {
    apiVisitorSig().then((data)=>{
      commit('chat/SET_IMUSERINFO', data, {root: true})
      setIMUser({userId: data.userid, userSig: data.userSig})
    }).catch(() => {
      commit('chat/SET_IMUSERINFO', {}, {root: true})
    })
  },
  //获取用户详情
  getUserInfoAction({ commit }){
    apiUserDetail().then((data)=>{
      commit('SET_USERINFO', data)
    }).catch(() => {
      commit('SET_TOKEN', '')
      commit('SET_USERINFO', {})
      removeToken()
    })
  },
  //获取用户经验值
  getUserLevel({ commit }){
    apiUserLevel().then((result)=>{
      commit('SET_LEVEL', result)
    }).catch(() => {
      commit('SET_TOKEN', '')
      commit('SET_USERINFO', {})
      removeToken()
    })
  },
  // 查询申请主播
  getAnchorState({ commit }){
    apiSearchAnchorState().then(res => {
      if(res.isate){
        commit('SET_APPLYSTEP', res.isate)
      }else{
        commit('SET_APPLYSTEP', 4)
      }
    })
  },
  // 获取任务列表
  getTask({ commit }){
    apiTaskCenterList({mode:0}).then(res=>{
      commit('SET_TASK', {key:'newArr',res:res})
    })
    apiTaskCenterList({mode:1}).then(res=>{
      commit('SET_TASK', {key:'dayArr',res:res})
    })
    apiTaskCenterList({mode:2}).then(res=>{
      commit('SET_TASK', {key:'kingArr',res:res})
    })
  },
  // 任务记录
  getTaskRecord({ dispatch }, type) {
    apiTaskRecord({type}).then(()=>{
      // dispatch("getUserLevel")
      dispatch("getUserInfoAction");
      dispatch("getUserLevel");
    })    
  },
  // 任务领取
  getGift({ dispatch, commit, state }, data){ 
    apiGetTask({type:data.id}).then(res=>{
      if(data.type == 1){
        let arr = state.task.newArr
        arr.forEach(item =>{
          if(item.type == data.id){
            item.receive = 2
          }
        })
        commit('SET_TASK', {key:'newArr',res:arr})
      }else if(data.type == 2){
        let arr = state.task.dayArr
        arr.forEach(item =>{
          if(item.type == data.id){
            item.receive = 2
          }
        })
        commit('SET_TASK', {key:'dayArr',res:arr})
      }else{
        let arr = state.task.kingArr
        arr.forEach(item =>{
          if(item.type == data.id){
            item.receive = 2
          }
        })
        commit('SET_TASK', {key:'kingArr',res:arr})
      }
      dispatch("getUserInfoAction");
      dispatch("getUserLevel");
      if(data.message) {
        data.message.success("领取成功")
      }      
    })
  },
  // 退出登录
  logout({ commit, dispatch }){
    commit('SET_TOKEN', '')
    commit('SET_USERINFO', {})
    dispatch('getVisitorSig')
    removeToken()
    removeIMUser()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}