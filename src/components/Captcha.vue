<template>
  <div class="captcha">
    <el-input v-model="inputValue" @input="handleInput" :maxlength="6" placeholder="请输入验证码" clearable></el-input>
    <el-button type="primary" @click.prevent="handleShowGraphCode" :disabled="!isMobileYes">{{graphCodeBtnText}}</el-button>
    <my-dialog width="350px" :appendToBody="true" ref="myDialog" @close="graphCode=''" class="graph-code-dialog">
      <div class="staticCode">
        <div class="staticCode_subtitle">为了您账号安全，请完成以下验证</div>
        <div class="staticCode_code">
          <el-input type="text" v-model="graphCode" placeholder="请输入验证码" :maxlength="4" autocomplete="off" clearable></el-input>
          <div class="staticCode_img">
            <img :src="imgUrl" height="35px" @click="getStaticCode()">
          </div>
        </div>
        <el-button type="primary" @click="getVPhone('ruleForm')">确认</el-button>
      </div>
    </my-dialog>
  </div>
</template>

<script>
import MyDialog from '@/components/Common/MyDialog'

import { apiVPhone } from '@/api/base'

export default {
  components: {
    MyDialog
  },
  props: {
    value: String,
    mobileNo: {
      type: [Number, String],
      default: ''
    },
    types: {
      type: String,
      default: '5'
    }
  },
  computed: {
    isMobileYes() {
      return /^1[3-9]\d{9}$/.test(this.mobileNo) && this.delay === 60
    }
  },
  watch:{
    value(newValue){
      this.inputValue = newValue
    }
  },
  data(){
    return {
      inputValue: '',
      graphCode: '',
      imgUrl: '',
      graphCodeBtnText: '获取验证码',
      delay: 60,
      timer: 0
    }
  },
  methods: {
    handleInput() {
      this.$emit('input', this.inputValue)
    },
    //获取图形验证码
    getStaticCode() {
      this.imgUrl = `http://api.feishulive.com/base/getStaticCode?mobileNo=${this.mobileNo}&v=${new Date().getTime()}`
    },
    // 获取验证码
    getVPhone() {
      return new Promise((resolve, reject) => {
        let params = {
          mobileNo: this.mobileNo,
          types: this.types,
          imgYzm: this.graphCode
        }
        apiVPhone(params).then(data => {
          this.$message.success('验证码已发送')
          this.$refs.myDialog.hide()
          this.timer = setInterval(()=>{
            if(this.delay == 0){
              clearInterval(this.timer)
              this.delay = 60
              this.graphCodeBtnText = '获取验证码'
            }else{
              this.graphCodeBtnText = `${this.delay--}秒后重试`
            }
          }, 1000)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    handleShowGraphCode(){
      this.getStaticCode()
      this.$refs.myDialog.show()
    }
  }
}
</script>

<style lang="scss">
.graph-code-dialog.el-dialog__wrapper {
  .el-dialog {
    padding: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .el-dialog__header {
      line-height: 46px;
      padding-left: 20px;
      padding-top: 10px;
      .el-dialog__title {
        font-size: 22px;
      }
      .el-dialog__headerbtn {
        top: 13px;
        right: 14px;
        .el-icon-close {
          font-size: 32px;
        }
      }
    }
    .staticCode {
      font-size: 16px;
      padding: 13px 40px 25px;
      .staticCode_subtitle {
        font-size: 1em;
        color: #999;
        text-align: center;
      }
      .staticCode_code {
        margin: 22px 0;
        position: relative;
        input {
          font-size: 16px;
        }
        .staticCode_img {
          width: 105px;
          height: 35px;
          position: absolute;
          top: 0;
          right: 0;
          border: 1px solid #eee;
        }
      }
      .el-button--primary {
        width: 100%;
        height: 42px;
        line-height: 19px;
        font-size: 18px;
        border-radius: 7px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.captcha{
  display: flex;
  .el-button{
    margin-left: 10px;
    padding: 0 8px;
    width: 150px;
  }
  .el-button--primary.is-disabled {
    background-color: #999;
    border-color: #999;
    &:hover, &:focus, &:active {
      background-color: #999;
      border-color: #999;
    }
  }
}
</style>