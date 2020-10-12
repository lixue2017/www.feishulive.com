<template>
  <div>
    <div class="title">登录</div>
    <div class="login_tab">
      <div class="active">账号密码</div>
      <div @click="handleAction('CaptchaLogin')">手机验证码</div>
    </div>
    <el-form :model="userInfo" ref="userPass" :rules="rulesPass" label-width="100px" class="demo-ruleForm">
      <el-form-item prop="mobileNo" label-width="0">
        <el-input type="text" v-model="userInfo.mobileNo" placeholder="手机号码" maxlength="11" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item prop="password" label-width="0">
        <el-input type="password" v-model="userInfo.password" placeholder="请输入密码" @keydown.native="keydownFn($event)" autocomplete="new-password" clearable></el-input>
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
export default {
  data(){
    let validateMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号码不能为空'));
      }
      if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))){ 
        return callback(new Error('手机号码有误，请重填')); 
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if(value.length>20 || value.length < 6){
        callback(new Error('密码在6-20字符之间，请重填')); 
      }
    };
    return {
      userInfo: {
        mobileNo: '',
        password: ''
      },
      rulesPass: {
        mobileNo: [
          { validator: validateMobile, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      validResult:false
    }
  },  
  watch: {
    userInfo: {
      deep:true, //深度监听设置为 true
      handler:function(val){
        if(this.validMobile(val.mobileNo) && this.validPassword(val.password)) {
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
      this.$store.commit('user/DIALOG_TAB', 3);
      this.$emit('submit', {
        mobileNo: this.userInfo.mobileNo,
        password: this.userInfo.password,
        deviceId: 'feishu_h5',
        deviceName: 'feishu_h5'
      })
    },
    validateFn(props,valid) {
      // this.validResult[props] = valid
    },
    validPassword(val) {
      if(val&&val.length<=20&&val.length>=6){
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