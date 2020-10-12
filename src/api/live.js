import request from '@/utils/request'

// 获取直播分类
export const apiChannelList = (data) => request.post('/home/homeChannelList ', data)

//关注
export const apiHomeLiveList = (data) => request.post('/live/homeLiveList', data)

//申请主播
export const apiAddAnchor = (data) => request.post('/live/addAnchor', data)

// 进入直播间查询主播信息
export const apiLiveRoomInfo = (data) => request.post('/live/loadLiveRoomInfo', data)

// 获取是否订阅该直播
export const apiIsSubscribe = (data) => request.post('/live/getIsSubscribe', data)

// 任务中心
export const apiTaskCenterList = (data) => request.post('/my/getTaskCenterList', data)

// 领取任务
export const apiGetTask = (data) => request.post('/my/getTaskCenter', data)

// 任务记录
export const apiTaskRecord = (data) => request.post('/my/saveTaskRecord', data)

// 获取礼物列表
export const apiGiftList = (data) => request.post('/live/getGiftList', data)

// 赠送礼物
export const apiGiveGift = (data) => request.post('/live/giveGift', data)

// 直播间贡献榜
export const apiRankList = (data) => request.post('/live/getRankList', data)

// 添加房管
export const apiAddRoomManager = (data) => request.post('/live/addRoomManager', data)

//是否为房管
export const apiRoomAdmin = (data) => request.post('/live/isLiveRoomManager', data)

//是否为房管
export const apiRoomAdminById = (data) => request.post('/live/isLiveRoomManagerById', data)

//禁言
export const apiBlacklist = (data) => request.post('/live/addBlacklist', data)

//取消房管
export const apiCancelRoomAdmin = (data) => request.post('/live/delRoomManager', data)
