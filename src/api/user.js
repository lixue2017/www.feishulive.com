import request from '@/utils/request'

//直播类型
export const apiLiveType = () => request.post('/home/homeChannelList')

//直播领域
export const apiLiveDoman = (data) => request.post('/home/selectLiveDomanById', data)

//获得直播间
export const apiLiveRoom = () => request.post('/live/getLiveRoom')

//保持直播间信息
export const apiSaveLiveRoom = (data) => request.post('/live/updateLiveroomDetails', data)

//我的消息-订阅消息
export const apiSubscribeMessage = (data) => request.post('/my/loadSubscribeMessageList', data)

//我的消息-公告消息
export const apiUserMessage = (data) => request.post('/my/loadUserMessageList', data)

//房间管理
export const apiRoomManage = (data) => request.post('/live/loadLiveRoomManager', data)

//黑名单
export const apiBlacklist = (data) => request.post('/live/loadBlacklist', data)

//解除房管
export const apiRelieveRoom = (data) => request.post('/live/delRoomManager', data)

//解除禁言
export const apiRelieveBlacklist = (data) => request.post('/live/delBlacklist', data)

//查询银行卡
export const apiQueryBank = (data) => request.post('/my/selectUserBank', data)

//取消关注
export const apiUnfocusLiveRoom = (data) => request.post('/live/unfocusLiveRoom', data)

//关注
export const apiFocusLiveRoom = (data) => request.post('/live/focusLiveRoom', data)

//查询是否关注
export const apiGetIsSubscribe = (data) => request.post('/live/getIsSubscribe', data)

//查询关注列表
export const apiFocusLiveRoomList = (data) => request.post('/live/loadfocusLiveRoomList', data)

//申请提现
export const apiTakeMoney = (data) => request.post('/my/addUserCash', data)

//直播收益-礼物记录
export const apiGiftList = (data) => request.post('/live/loadLiveroomProfitRecode', data)

//直播收益-粉丝贡献
export const apiFansList = (data) => request.post('/my/getMyDedicateList', data)

//直播收益-提现记录
export const apiTakeMoneyList = (data) => request.post('/my/loadUserCashList', data)

//直播收益-编辑银行卡
export const apiEditBank = (data) => request.post('/my/editUserBankInformation', data)

//用户经验值
export const apiUserLevel = (data) => request.post('/my/getUserLevels', data)

//查询申请主播
export const apiSearchAnchorState = (data) => request.post('/live/selectAnchorState', data)

//修改昵称前调用
export const apiSetUpdateModify = () => request.post('/my/setUpdateModify')

//修改昵称
export const apiUpdateNickName = (data) => request.post('/my/updateModify', data)

//修改手机号（旧）
export const apiUpdateMobile = (data) => request.post('/my/updateMobileCode', data)

//修改手机号（新）
export const apiUpdateMobileNew = (data) => request.post('/my/updateMobile', data)

//修改密码
export const apiUpdatePassword = (data) => request.post('/my/updatePassword', data)

//充值方式列表
export const apiCZModeList = (data) => request.post('/my/czModeList', data)

//充值数量列表
export const apiExchangeList= (data) => request.post('/my/exchangeList', data)

//充值二维码
export const apiPayLink= (data) => request.post('/my/addMoney', data)

//我的财富列表
export const apiWealthList= (data) => request.post('/my/purchaseRecord', data)

//查询微信支付订单
export const apiSearch= (data) => request.post('/my/orderQuery', data)

//刷新直播码
export const apiRefreshLivePush = (data) => request.post('/live/updateLiveroomPush', data)

// 房间举报
export const apiMyReport = (data) => request.post('/my/addMyReport', data)

// 客服中心
export const apiFeedback = (data) => request.post('/my/userFeedback', data)