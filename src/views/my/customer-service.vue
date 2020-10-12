<template>
  <div class="content">
    <div class="to_report">
      <div class="title">客服中心</div>
      <div class="reportForm">
        <my-form ref="myForm" :formConfig="formConfig">
          <template v-slot:form-submit>
            <div class="form-submit">
              <el-button type="primary" @click="$refs.myForm.submitForm()" v-loading="isLoading">提 交</el-button>
            </div>
          </template>
        </my-form>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
  import MyForm from '@/components/Common/MyForm'
  import { apiFeedback } from '@/api/user'
  export default {
    components: {
      MyForm
    },
    data() {
      return {          
        //举报信息
        isLoading: false,
        formConfig: {
          labelWidth: '200px',
          httpRequest: apiFeedback,
          successFunction: this.handleSuccess,
          successMessage: '客服中心已经收到您的反馈将尽快解决问题给您回复',
          fieldList: [{
            rows: [{
              cols: [{
                id: 'problem', label: '问题与建议', type: 'textarea', rows: 5, placeholder: '请填写您遇到的问题或意见！'
              }]
            }]
          },{
            rows: [{
              cols: [{
                id: 'contact', label: '联系方式', placeholder: '手机号/微信号/QQ号'
              }]
            }]
          }],
          formRules: {
            contact: [
              { required: true, message: '手机号/微信号/QQ号不能为空', trigger: 'blur' }
            ],
            problem: [
              { required: true, message: '问题或意见不能为空', trigger: 'blur' }
            ]
          }
        }
      }
    },
    methods: {
      handleSuccess() {
        // this.$message.success('客服中心已经收到您的反馈将尽快解决问题给您回复')
        this.$refs.myForm.setFormModel({
          problem: ''
        })
        // this.$confirm('', "提示", {
        //   confirmButtonText: "反馈成功",
        //   cancelButtonText: "返回首页",
        //   customClass: "confirm-tip",
        //   center: true,
        //   showClose: false,
        //   cancelButtonClass: "cancelBtn",
        //   confirmButtonClass: "confirmBtn"
        // })
        // .then(() => {
        //   this.$router.push({ path: "/", query: {} });
        // })
        // .catch(() => {
        //   this.$refs.myForm.resetFields()
        // });
      }
    },
  }
</script>

<style lang="scss">
  .confirm-tip {
    width: 502px;
    .el-message-box__title {
      font-size: 30px;
      margin: 10px 0;
      color: #111
    }
    .el-message-box__content {
      display: none;
    }
    .el-message-box__btns {
      overflow: hidden;
      padding-top: 28px;
      padding-bottom: 20px;
      width: 346px;
      margin: auto;
      .cancelBtn, .confirmBtn {
        float: right;
        font-size: 22px;
        width: 140px;
        box-sizing: border-box;
      }
      .cancelBtn {
        color: #111;
      }
      .confirmBtn {
        margin-right: 64px;
        margin-left: 0;
      }
    }
    
  }
</style>

<style lang="scss" scoped>
.content {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .to_report {
    width: 95%;
    height: 100%;
    background: #ffffff;
    border-radius: 10px;
    margin: 20px auto;
    padding: 0 52px;
    box-sizing: border-box;
    margin-bottom: 50px;
    .title {
      font-size: 24px;
      color: #111111;
      margin-bottom: 45px;
      margin-top: 27px;
    }
    .reportForm {
      width: 650px;
      /deep/ .el-form-item {
        margin-bottom: 40px;
        .el-form-item__label:before {
          content: '*';
          color: #F56C6C;
          margin-right: 4px;
        }
        .el-input__inner {
          width: 260px;
        }
      }
    }
  }
}
</style>