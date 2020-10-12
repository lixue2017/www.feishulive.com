<template>
  <div class="draw-money">
    <my-form ref="myForm" :formConfig="formConfig">
      <template v-slot:code="{formModel}">
        <captcha :mobileNo="formModel.mobileNo" v-model="formModel['code']" />
      </template>
      <template v-slot:form-submit>
        <div class="form_tip">
请如实填写接收飞鼠兑换款额的银行卡信息，如有因您信息填写错误而导致转账失败的情况，飞鼠概不负责！为了您的财产安全，收款人姓名，身份证和银行卡号默认为您实名认证的信息，如收款人姓名和身份证需修改，请联系客服。
        </div>
        <div class="form-submit">
          <el-button type="primary" @click="handleSubmit" v-loading="isLoading">提 交</el-button>
        </div>
      </template>
    </my-form>
  </div>
</template>

<script>
import MyForm from '@/components/Common/MyForm'
import Captcha from '@/components/Captcha'

import { apiQueryBank, apiTakeMoney } from '@/api/user'
export default {
  components: {
    MyForm, Captcha
  },
  data() {
    return {
      isLoading: false,
      formConfig: {
        labelWidth: '200px',
        // successMessage: '操作成功',
        successFunction: this.handleSuccess,
        httpRequest: apiTakeMoney,
        fieldList: [{
          rows: [{
            cols: [{
              id: 'bankCard', label: '银行卡号', disable: true
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'bankName', label: '开户行', disable: true
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'bankDetails', label: '支行信息', disable: true
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'realName', label: '收款人', disable: true
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'idCard', label: '收款人身份证', disable: true
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'money', label: '提款金额' //1000000
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'mobileNo', label: '手机号码'
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'code', label: '手机验证码', type: 'slot'
            }]
          }]
        }],
        formRules: {
          money: [
            { required: true, message: '提款金额不能为空', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '非法输入,请输入数字' },
            { type: 'number', min: 100, max: 1000000, message: '提现金额范围100-1000000', transform(value){ return parseInt(value) }, trigger: 'blur' }
          ],
          mobileNo: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式错误', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '验证码不能为空', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '验证码只能输入数字' }
          ]
        },
        formModel:{
          types: '5'
        }
      }
    }
  },
  mounted () {
    apiQueryBank().then((result)=>{
      let _formModel = {
        bankCard: result.bankCard,
        bankName: result.bankName,
        bankDetails: result.bankDetails,
        realName: result.realName,
        idCard: result.idCard
      }
      this.$refs.myForm.setFormModel(_formModel)
    })
  },
  methods: {
    handleSubmit() {
      this.$refs.myForm.submitForm()
    },
    handleSuccess() {
      let _formModel = this.$refs.myForm.formModel
      _formModel.money = ""
      _formModel.mobileNo = ""
      _formModel.code = ""
      this.$refs.myForm.setFormModel(_formModel)
      
      this.$message({
        showClose: true,
        message: '<div>提交成功！可点击<a href="/#/my/live-earn">提现记录</a>查看最新情况</div>',
        dangerouslyUseHTMLString: true,
        offset: 300,
        duration: 3000,
        customClass: "draw-money-tip",
        type: 'success'
      });
    }
  }
}
</script>

<style>
  .el-message.draw-money-tip {
    left: calc(50% + 150px);
  }
</style>

<style lang="scss" scoped>
.draw-money{
  width: 95%;
  margin: 20px auto;
  box-sizing: border-box;
  background: #fff;
  border-radius: 10px;
  padding: 40px 300px 20px 200px;
}
.form_tip{
  color: #111111;
  &:before{
    content: '*';
    color: #f00;
  }
}
.form-submit{
  margin-top: 50px;
  text-align: center;
  .el-button{
    height: 60px;
    width: 230px;
    font-size: 24px;
    font-weight: bold;
    color: #ffffff;
  }
}
</style>