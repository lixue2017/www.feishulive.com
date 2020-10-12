import request from '@/utils/request'

// 获取下载链接
export const apiLiveVersion = (data) => request.post('/base/getLiveVersion', data)