<template>
  <div class="bind-mobile">
    <div v-if="step==1" class="hint"><i class="el-icon-info"></i>为了您的账号安全，请先验证您绑定的手机号</div>
    <my-form ref="myForm" class="myForm" :formConfig="formConfig" @before-request="isLoading=true" @complete-request="isLoading=false" @input-validate="handleFormValidate">
      <!-- 验证码slot -->
      <template v-slot:code="{formModel}">
        <captcha :mobileNo="formModel.mobileNo" :types="types" v-model="formModel['code']" v-if="captcha"/>
      </template>
      <!-- form submit slot -->
      <template v-slot:form-submit>
        <div class="form-submit">
          <el-button class="submit-button" type="primary" :disabled="isDisabledSubmit" @click="$refs.myForm.submitForm()" v-loading="isLoading">{{ confirmText }}</el-button>
          <el-button @click="$parent.switchComp('Encrypt')">取 消</el-button>
        </div>
      </template>
    </my-form>
  </div>
</template>

<script>
import MyForm from '@/components/Common/MyForm'
import Captcha from '@/components/Captcha'

import { apiUpdateMobile, apiUpdateMobileNew } from '@/api/user'

export default {
  components: {
    MyForm, Captcha
  },
  props: {
    mobileNo: String
  },
  data(){
    return {
      isDisabledSubmit: true,
      isLoading: false,
      captcha: true,
      types: "2", //2旧手机号3新手机号
      step: 1,
      confirmText: '下一步',
      formConfig: {
        labelWidth: '200px',
        httpRequest: apiUpdateMobile,
        successFunction: this.nextStep,
        getFormParams(formData){
          delete formData.displayMobileNo
          return formData
        },
        fieldList: [{
          rows: [{
            cols: [{
              id: 'displayMobileNo', label: '手机号', disable: true
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'mobileNo', label: '手机号', placeholder: '请输入新的手机号', maxlength: 11, visible: false
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'code', label: '验证码', type: 'slot'
            }]
          }]
        }],
        formRules: {
          mobileNo: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式错误', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '验证码不能为空', trigger: 'blur' },
            { min: 6, max: 6, message: '请输入6位数字验证码', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入6位数字验证码', trigger: 'blur' }
          ]
        }
      }
    }
  },
  mounted () {
    this.$refs.myForm.setFormModel({
      mobileNo: this.mobileNo,
      displayMobileNo: this.mobileNo.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
    })
  },
  methods: {
    nextStep() {
      if(this.step === 1){
        this.step = 2
        //刷新验证码
        this.types = "3"
        this.captcha = false;
        this.$nextTick(function(){
          this.captcha = true;
        })
        //清空手机号和验证码
        this.$refs.myForm.formModel.mobileNo = ''
        this.$refs.myForm.formModel.code = ''
        //隐藏星号手机号, 显示输入手机号
        this.$refs.myForm.visibleAll.displayMobileNo = false
        this.$refs.myForm.visibleAll.mobileNo = true
        
        this.formConfig.httpRequest = apiUpdateMobileNew
        this.confirmText = '确定'
      }else{
        this.$parent.switchComp('Encrypt')
      }
    },
    //实时验证表单
    handleFormValidate(value){
      this.isDisabledSubmit = !value
    }
  }
}
</script>

<style lang="scss" scoped>
.bind-mobile{
  margin: 0 auto;
  padding-top: 25px;
  padding-bottom: 50px;
  .hint{
    padding-left: 130px;
    font-size: 18px;
    color: #111111;
    line-height: 40px;
  }
  .myForm{
    width: 500px;
    .submit-button.is-disabled {
      background-color: #999;
      border-color: #999;
      &:hover, &:focus, &:active {
        background-color: #999;
        border-color: #999;
      }
    }
  }
}
</style>