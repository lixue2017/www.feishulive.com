import request from '@/utils/request'

//图形验证码
export const apiStaticCode = (data) => request.get('/base/getStaticCode', data)

//验证码
export const apiVPhone = (data) => request.get('/base/getVPhone', data)

//用户注册
export const apiRegister = (data) => request.post('/web/register', data)

//忘记密码
export const apiPassword = (data) => request.post('user/updatePassword', data)

//登录
export const apiLogin = (data) => request.post('/web/phoneLogin', data)

//手机验证码登录
export const apiPhoneLoginYZM = (data) => request.post('/web/phoneLoginYZM', data)

//用户详情
export const apiUserDetail = (data) => request.post('/my/getUserDetails', data)

//检验昵称是否存在
export const apiVerificationNickName = (data) => request.post('/user/verificationNickName', data)

//游客身份
export const apiVisitorSig = (data) => request.post('/user/genVisitorSig', data)
