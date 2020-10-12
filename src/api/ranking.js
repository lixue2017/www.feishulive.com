import request from '@/utils/request'

//主播排行榜
export const apiApplication = (data) => request.post('/home/getContributionList', data)