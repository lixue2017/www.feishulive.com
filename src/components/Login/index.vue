<template>
<el-dialog
  :visible.sync="dialogStauts"
  :close-on-click-modal="false"
  append-to-body
  width="520px"
  top="0"
  :before-close="handleClose">
  <component :ref="dynamicName" :is="dynamicName" @action="(name)=>{this.dynamicName=name}" @submit="handleSubmit"></component>
</el-dialog>
</template>

<script>
import CaptchaLogin from './CaptchaLogin'
import PwdLogin from './PwdLogin'
import Register from './Register'
import ForgotPwd from './ForgotPwd'


import { mapGetters } from 'vuex';
export default {
  components: {
    CaptchaLogin, PwdLogin, Register, ForgotPwd
  },
  data() {
    return {
      //默认是验证码登录
      dynamicName: 'CaptchaLogin'
    }
  },
  computed: {
    ...mapGetters(["dialogStauts", "userDialog"])
  },
  watch:{
    dialogStauts(newValue, oldValue){
      if(newValue){
        this.dynamicName = 'CaptchaLogin'
        this.$nextTick(()=>{
          this.$refs.CaptchaLogin.resetForm()
        })
      }
    },
    userDialog(newValue) {
      let name = ['','Register', 'ForgotPwd', 'PwdLogin', 'CaptchaLogin']
      this.dynamicName = name[newValue]
    }
  },
  methods: {
    handleSubmit(data){
      this.$store.dispatch('user/login', data)
    },
    handleClose() {
      this.$store.commit('user/DIALOG_SHOW', false);
    }
  }
};
</script>
<style lang="scss" scope>
.el-dialog__wrapper {
  .el-input__inner {
    color: #101010;
  }
  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fefdfd;
    padding: 30px 51px 33px 56px;
    border-radius: 14px;
    div{
      font-size: 20px;
      &.el-form-item__error {
        font-size: 14px;
      }
    }
    .el-dialog__header,.el-dialog__body {
      padding: 0;
    }
    .el-dialog__headerbtn {
      .el-dialog__close {
        font-size: 2.5em;
        &:hover {
          color: #F56C6C;
        }
      }
    }
    
    .title {
      font-size: 1.6em;
      font-weight: bold;
      color: #020046;
      line-height: 82px;
    }
    .subtitle {
      font-size: 1.2em;
      font-weight: bold;
      color: #020046;
      line-height: 82px;
    }
    .login_tab {
      width: 270px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgba(22,15,83,0.2);
      margin: 38px 0 35px;
      div {
        font-size: 1.2em;
        color: rgba(2,0,70,0.8);
        padding-bottom: 9px;
        font-weight: bold;
        border-bottom: 4px solid transparent;
        cursor: pointer;
        &.active {
          color: #42EDC4;
          border-bottom-color: #42EDC4;
        }
      }
    }
    .el-input {
      font-size: 1em;
      color: #101010;
      input {
        width: 100%;
        font-size: 1em;
        padding: 0;
        border: none;
        border-bottom: 1px solid rgba(22,15,83,0.2);
        line-height: 42px;
        background: transparent;
        border-radius: 0; 
      }
    }
    .el-form-item__content {
      text-align: center;
      font-size: 1em;
      .login-submit-button {
        width: 308px;
        height: 69px;
        line-height: 43px;
        font-size: 1.3em;
        border-radius: 7px;
      }
      .el-select {
        width: 82px;
        position: absolute;
        z-index: 1;
        .el-input {
          input {
            border: none;
            text-align: left;
          }
          .el-select__caret {
            font-size: 1em;
          }
        }
      }
    }
    .mobile {
      .el-input {
        input {
          text-align: right;
          padding-right: 30px;
        }
      }
    }
    .code {
      .el-form-item__content {
        .el-button--primary {
            width: 150px;
            font-size: 16px;
            height: 40px;
            line-height: 16px;
            padding: 0 8px;
        }
      }
    }
    .agree {
      .el-form-item__content {
        text-align: left;
        line-height: 24px;
        display: flex;
        // margin-top: -7px;
        .circle {
          width: 16px;
          height: 16px;
          line-height: 18px;
          margin-left: 17px;
          border: 2px solid #999;
          border-radius: 50%;
          cursor: pointer;
        }
        .el-icon-circle-check {
          font-size: 1em;
          color: #42EDC4;
          margin-left: 17px;
          cursor: pointer;
        }
        .agree-text {
          width: 346px;
          font-size: 0.9em;
          color: #999999;
          padding-left: 15px;
          a {
            color: #999999;
            text-decoration: none;
          }
        }
      }
    }
    .switch {
      color: #666;
      margin-bottom: 0px;
      span {
        font-size: 1em;
        &.login_btn {
          color: #42EDC4;
          padding-left: 8px;
          cursor: pointer;
        }
        &.forget_btn {
          display: inline-block;
          color: #999;
          border-bottom: 1px solid #999;
          margin-bottom: 25px;
          margin-top: 12px;
          line-height: 22px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>