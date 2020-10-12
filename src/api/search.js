import request from '@/utils/request'

//搜索
export const apiSearch = (data) => request.post('/home/homeSearch', data)

//我的订阅
export const apiGetSubscribe = (data) => request.post('/live/loadfocusLiveRoomList', data)