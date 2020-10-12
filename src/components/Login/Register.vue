<template>
  <div>
    <div class="title">注册</div>
    <div class="subtitle">手机号码</div>
    <el-form :model="userInfo" ref="userRegister" :rules="rulesRegister" label-width="100px" class="demo-ruleForm">
      <el-form-item prop="mobileNo" label-width="0" :class="'mobile'">
        <el-select v-model="userInfo.num">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input type="text" v-model="userInfo.mobileNo" placeholder="手机号码" maxlength="11" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item prop="nickName" label-width="0"> 
        <el-input type="text" v-model="userInfo.nickName" placeholder="昵称" maxlength="6" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item prop="password" label-width="0">
        <el-input type="password" v-model="userInfo.password" placeholder="请设置您的密码" autocomplete="new-password" clearable></el-input>
      </el-form-item>
      <el-form-item prop="code" label-width="0" :class="'code'">
        <!-- <el-input type="text" v-model="userInfo.code" placeholder="请输入验证码" @keydown.native="keydown($event)" autocomplete="off"></el-input>
        <el-button type="primary" @click="getStaticCode(3)">获取验证码</el-button> -->
        <captcha :mobileNo="userInfo.mobileNo" types="3" v-model="userInfo.code" @keydown.native="keydownFn($event)" />
      </el-form-item>
      <el-form-item :class="'agree'" prop="agree" label-width="0">
        <div class="circle" v-if="!userInfo.agree" @click="userInfo.agree=!userInfo.agree"></div>
        <div class="el-icon-circle-check" v-if="userInfo.agree" @click="userInfo.agree=!userInfo.agree"></div>
        <div class="agree-text">我已阅读并同意<a href="http://sc.feishulive.com/agreement/user1.html" target="_blank">《飞鼠直播服务协议》</a>和<a href="http://sc.feishulive.com/agreement/user2.html" target="_blank">《隐私政策》</a>。</div>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button class="login-submit-button" :type="validResult?'primary':'info'" :disabled="validResult?false:'disabled'" @click="handleSubmit">立即注册</el-button>
      </el-form-item>
      <el-form-item :class="'switch'" label-width="0">
        <span>已经有账户？</span>
        <span class="login_btn" @click="handleAction">立即登录</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import Captcha from '../Captcha'
import { apiVerificationNickName } from '@/api/base'
export default {
  components: {
    Captcha
  },
  data(){
    let validateMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号码不能为空'));
      }
      if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))){ 
        return callback(new Error('手机号码有误，请重填')); 
      }
    };
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('昵称不能为空'));
      }
      if(value.length>=6||value.length<=1){ 
        return callback(new Error('昵称在1-6字符之间，请重填')); 
      }else {
        apiVerificationNickName({nickName:value}).then((res)=>{
          if(res.exist) {
            return callback(new Error('昵称已被占用!'));
          }           
        })
      }      
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if(value.length>20 || value.length < 6){
        callback(new Error('密码在6-20字符之间，请重填')); 
      }
    };
    let validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      }
    };

    return {
      userInfo: {
        num: 1,
        mobileNo: '',
        nickName: '',
        password: '',
        checkpass: '',
        code: '',
        imgYzm: '',
        agree: false
      },
      options: [{
        value: 1,
        label: '+86'
      }],
      rulesRegister: {
        mobileNo: [
          { validator: validateMobile, trigger: 'blur' }
        ],
        nickName: [
          { validator: validateName, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        code: [
          { validator: validateCode, trigger: 'blur' }
        ]
      },
      validResult:false
    }
  },  
  watch: {
    userInfo: {
      deep:true, //深度监听设置为 true
      handler:function(val){
        if(this.validMobile(val.mobileNo) && this.validPassword(val.password) && this.validNickName(val.nickName) && val.code.trim() && val.agree) {
          apiVerificationNickName({nickName:val.nickName}).then((res)=>{
            if(!res.exist) {
              this.validResult = true
            }           
          })
        }else {
          this.validResult = false
        }
      }
    }
  },
  methods: {
    keydownFn(e) {
      if(e.keyCode == 13) {
        this.handleSubmit()
      }
    },
    handleAction() {
      this.$emit('action', 'CaptchaLogin')
    },
    handleSubmit(){
      if(!this.validResult) return
      this.$store.commit('user/DIALOG_TAB', 1);
      this.$emit('submit', {
        mobileNo: this.userInfo.mobileNo,
        nickName: this.userInfo.nickName,
        password: this.userInfo.password,
        code: this.userInfo.code,
        types: 3
      })     
    },
    validPassword(val) {
      if(val&&val.length<=20&&val.length>=6){
        return true
      }
      return false
    },
    validNickName(val) {
      if(val&&val.length<=20&&val.length>=2){
        return true
      }
      return false
    },
    validMobile(val) {
      if(val&&(/^1(3|4|5|6|7|8|9)\d{9}$/.test(val))){
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>