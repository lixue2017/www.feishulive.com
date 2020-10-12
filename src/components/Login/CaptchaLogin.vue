<template>
  <div>
    <div class="title">登录</div>
    <div class="login_tab">
      <div @click="handleAction('PwdLogin')">账号密码</div>
      <div class="active">手机验证码</div>
    </div>
    <el-form :model="userInfo" ref="userCode" :rules="rulesCode" label-width="100px" class="demo-ruleForm">
      <el-form-item prop="mobileNo" label-width="0" :class="'mobile'">
        <el-select v-model="userInfo.num">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input type="text" v-model="userInfo.mobileNo" placeholder="手机号码" maxlength="11" autocomplete="new-password" clearable></el-input>
      </el-form-item>
      <el-form-item prop="code" label-width="0" :class="'code'">
        <!-- <el-input type="text" v-model="userInfo.code" placeholder="请输入验证码" @change="keydown($event)" autocomplete="new-password"></el-input>
        <el-button type="primary" @click="getStaticCode(0)">获取验证码</el-button> -->
        <captcha :mobileNo="userInfo.mobileNo" types="0" v-model="userInfo.code"  @keydown.native="keydownFn($event)"/>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button class="login-submit-button" :type="validResult?'primary':'info'" :disabled="validResult?false:'disabled'" @click="handleSubmit" style="margin-top: 18px;">登录</el-button>
      </el-form-item>
      <el-form-item :class="'switch'" label-width="0">
        <span @click="handleAction('ForgotPwd')" class="forget_btn">忘记密码</span>
      </el-form-item>
      <el-form-item :class="'switch'" label-width="0">
        <span>没有账号？</span>
        <span class="login_btn" @click="handleAction('Register')">注册</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import Captcha from '../Captcha'
export default {
  components: {
    Captcha,
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
      rulesCode: {
        mobileNo: [
          { validator: validateMobile, trigger: 'blur' }
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
        if(this.validMobile(val.mobileNo) && val.code.trim()) {
          this.validResult = true
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
    handleAction(name) {
      this.$emit('action', name)
    },
    handleSubmit(){
      if(!this.validResult) return
      this.$store.commit('user/DIALOG_TAB', 4);
      this.$emit('submit', {
        mobileNo: this.userInfo.mobileNo,
        code: this.userInfo.code,
        types: 0,
        deviceId: 'feishu_h5',
        deviceName: 'feishu_h5'
      })
    },
    validMobile(val) {
      if(val&&(/^1(3|4|5|6|7|8|9)\d{9}$/.test(val))){
        return true
      }
      return false
    },
    resetForm(){
      this.$refs.userCode.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>