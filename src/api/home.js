import request from '@/utils/request'

//首页列表
export const apiHomeLiveList = (data) => request.post('/live/homeLiveList', data)

// 首页
export const apiLiveRecommend = (data) => request.post('/home/loadLiveRecommend', data)

// 首页列表查询更多
export const apiLiveRoomMore = (data) => request.post('/home/loadLiveRoomMore', data)

// 查询分类与领域
export const apiCategoryDoman = (data) => request.post('home/selectCategoryDoman', data)