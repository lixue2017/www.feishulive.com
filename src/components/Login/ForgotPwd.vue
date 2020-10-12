<template>
  <div>
    <div class="title">忘记密码</div>
    <div class="subtitle">手机号码</div>
    <el-form :model="userInfo" ref="userForget" :rules="rulesForget" label-width="100px" class="demo-ruleForm">
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
      <el-form-item prop="code" label-width="0" :class="'code'">
        <!-- <el-input type="text" v-model="userInfo.code" placeholder="请输入验证码" autocomplete="off"></el-input>
        <el-button type="primary" @click="getStaticCode(1)">获取验证码</el-button> -->
        <captcha :mobileNo="userInfo.mobileNo" types="1" v-model="userInfo.code" />
      </el-form-item>
      <el-form-item prop="password" label-width="0">
        <el-input type="password" v-model="userInfo.password" placeholder="请输入新密码" autocomplete="new-password" clearable></el-input>
      </el-form-item>
      <el-form-item prop="checkpass" label-width="0"> 
        <el-input type="password" v-model="userInfo.checkpass" placeholder="再次输入密码" @keydown.native="keydownFn($event)" autocomplete="new-password" clearable></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button class="login-submit-button" :type="validResult?'primary':'info'" :disabled="validResult?false:'disabled'" @click="handleSubmit">确认</el-button>
      </el-form-item>
      <el-form-item :class="'switch'" label-width="0">
        <span>已经有账户？</span>
        <span class="login_btn" @click="handleAction">登录</span>
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if(value.length>20 || value.length < 6){
        callback(new Error('密码在6-20字符之间，请重填')); 
      } else {
        if (this.userInfo.checkPass !== '') {
          this.$refs.userForget.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userInfo.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
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
        password: '',
        checkpass: '',
        code: '',
        imgYzm: ''
      },
      options: [{
        value: 1,
        label: '+86'
      }],
      rulesForget: {
        mobileNo: [
          { validator: validateMobile, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkpass: [
          { validator: validatePass2, trigger: 'blur' }
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
        if(this.validMobile(val.mobileNo) && this.validPassword(val.password) && val.password == val.checkpass && val.code.trim()) {
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
    handleAction() {
      this.$emit('action', 'CaptchaLogin')
    },
    handleSubmit(){
      if(!this.validResult) return
      this.$store.commit('user/DIALOG_TAB', 2);
      this.$store.dispatch('user/forgotPwd', {
        mobileNo: this.userInfo.mobileNo,
        password: this.userInfo.password,
        code: this.userInfo.code,
        types: 1
      }) 
      // this.$emit('submit', {
      //   mobileNo: this.userInfo.mobileNo,
      //   password: this.userInfo.password,
      //   code: this.userInfo.code,
      //   types: 1
      // })
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