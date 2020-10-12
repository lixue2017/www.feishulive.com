<template>
  <div class="content">
    <div class="to_report">
      <div class="title">房间举报</div>
      <div class="reportForm">
        <my-form ref="myForm" :formConfig="formConfig">
          <template v-slot:itype="{formModel, selectAll}" >
            <el-checkbox-group v-model="formModel['itype']" style="width:80%">
              <el-checkbox v-for="selectItem in selectAll['itype']" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-checkbox>
            </el-checkbox-group>
          </template>
          <template v-slot:image="{formModel}">
            <Upload v-model="formModel['image']" :uploadStyle="{width:'200px', height:'200px'}" />               
          </template>
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
  import {apiMyReport } from '@/api/user'
  import Upload from '@/components/Upload'
  export default {
    components: {
      MyForm,
      Upload
    },
    data() {
      return {          
        //举报信息
        isLoading: false,
        formConfig: {
          labelWidth: '200px',
          httpRequest: apiMyReport,
          afterMounted(){
            let roomName = this.$route.query.roomTitle
            let roomId = this.$route.query.roomId
            this.setFormModel({ roomName, roomId })
          },
          getFormParams: function(formData) {
            formData.itype = formData.itype.join(",")
            return formData
          },
          successFunction: this.handleSuccess,
          fieldList: [{
            rows: [{
              cols: [{
                id: 'roomName', label: '被举报人房间名称和房间号', disable: true, placeholder: '足球 -英超-外围', span: 18
              }, {
                id: 'roomId', label: '', labelWidth: '0', disable: true, placeholder: "123321", span: 6
              }]
            }]
          },{
            rows: [{
              cols: [{
                id: 'itype', label: '举报原因', type: 'slot',value: [], options: [{
                  label: '涉政', value: '涉政'
                }, {
                  label: '暴恐血腥', value: '暴恐血腥'
                }, {
                  label: '色情、低俗', value: '色情、低俗'
                }, {
                  label: '涉赌', value: '涉赌'
                }, {
                  label: '涉骗', value: '涉骗'
                }, {
                  label: '私服、外挂', value: '私服、外挂'
                }, {
                  label: '弹幕违规', value: '弹幕违规'
                }, {
                  label: '未授权内容', value: '未授权内容'
                }, {
                  label: '其它违规', value: '其它违规'
                }]
              }]
            }]
          },{
            rows: [{
              cols: [{
                id: 'content', label: '举报说明', type: 'textarea', rows: 5, placeholder: '请您将问题详细描述，便于我们更好的为您服务！'
              }]
            }]
          },{
            rows: [{
              cols: [{
                id: 'mobileNo', label: '联系方式', placeholder: '手机号/微信号/QQ号'
              }]
            }]
          }, {
            rows: [{
              cols: [{
                id: 'image', label: '举报图片', type: 'slot', 
              }]
            }]
          }],
          formRules: {
            // roomId: [{ required: true, message: '请输入举报人房间号' }],
            // roomName: [{ required: true, message: '请输入举报人房间名称', trigger: 'blur' }],
            itype: [
              { required: true, message: '请选择举报原因' }
            ],
            mobileNo: [
              { required: true, message: '手机号/微信号/QQ号不能为空', trigger: 'blur' }
            ],
            content: [
              { required: true, message: '举报说明不能为空', trigger: 'blur' }
            ]
          }
        }
      }
    },
    methods: {
      handleSuccess() {
        this.$confirm('', "提示", {
          confirmButtonText: "举报完成",
          cancelButtonText: "返回首页",
          customClass: "confirm-tip",
          center: true,
          showClose: false,
          cancelButtonClass: "cancelBtn",
          confirmButtonClass: "confirmBtn"
        })
        .then(() => {
          this.$router.push({ path: "/", query: {} });
        })
        .catch(() => {
          this.$refs.myForm.resetFields()
        });
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
      margin-left: 100px;
      /deep/ .el-form-item {
        margin-bottom: 40px;
        .el-form-item__label:before {
          content: '*';
          color: #F56C6C;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>