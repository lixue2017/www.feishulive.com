import request from '@/utils/request'

// 广告图，轮播图
export const apiAdvertisement = (data) => request.post('/base/selectAdvertisement', data)