<template>
  <div class="set-pwd">
    <div class="hint"><i class="el-icon-info"></i>为了您的账号安全，请先验证您绑定的手机号</div>
    <my-form ref="myForm" class="myForm" :formConfig="formConfig" @before-request="isLoading=true" @complete-request="isLoading=false" @input-validate="handleFormValidate">
      <!-- 验证码slot -->
      <template v-slot:code="{formModel}">
        <captcha :mobileNo="formModel.mobileNo" types="1" v-model="formModel['code']" />
      </template>
      <!-- form submit slot -->
      <template v-slot:form-submit>
        <div class="form-submit">
          <el-button class="submit-button" type="primary" :disabled="isDisabledSubmit" @click="$refs.myForm.submitForm()" v-loading="isLoading">确 定</el-button>
          <el-button @click="$parent.switchComp('Encrypt')">取 消</el-button>
        </div>
      </template>
    </my-form>
  </div>
</template>

<script>
import MyForm from '@/components/Common/MyForm'
import Captcha from '@/components/Captcha'

import { apiUpdatePassword } from '@/api/user'
import { mapGetters } from 'vuex'

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
      formConfig: {
        labelWidth: '200px',
        httpRequest: apiUpdatePassword,
        successFunction: this.nextStep,
        fieldList: [{
          rows: [{
            cols: [{
              id: '_mobileNo', label: '手机号', placeholder: '请输入手机号', disable: true
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'code', label: '验证码', type: 'slot'
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'password', label: '新密码', type: 'password', maxlength: 26
            }]
          }]
        }],
        formRules: {
          code: [
            { required: true, message: '验证码不能为空', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '验证码只能输入数字' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min:6, message: '密码在6-20字符之间，请重填', trigger: 'blur' }
          ]
        },
        formModel: {
          mobileNo: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    this.$refs.myForm.setFormModel({
      mobileNo: this.userInfo.mobileNo,
      _mobileNo: this.userInfo.mobileNo.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
    })
  },
  methods: {
    nextStep() {
      this.$store.dispatch("user/logout")
      this.$router.push({path: '/',query:{}})
    },
    //实时验证表单
    handleFormValidate(value){
      this.isDisabledSubmit = !value
    }
  }
}
</script>

<style lang="scss" scoped>
.set-pwd{
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