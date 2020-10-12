<!--申请主播-->
<template>
  <div class="live-apply">
    <div class="content">
      <!-- 顶部进度条 -->
      <div class="top-step">
          <div class="step-list">
              <img src="../../assets/image/step4.png" alt="">身份验证
          </div>
          <div class="step-list">
              <img src="../../assets/image/step2.png" alt="" v-if="applyStep == 3 || applyStep == 4">
              <img src="../../assets/image/step7.png" alt="" v-else>
          </div> 
          <div class="step-list">
              <img src="../../assets/image/step3.png"  alt="" v-if="applyStep == 3 || applyStep == 4">
              <img src="../../assets/image/step5.png"  alt="" v-else>
              申请审批
          </div>                
          <div class="step-list">
              <img src="../../assets/image/step1.png" alt="" v-if="applyStep == 3 || applyStep == 4">
              <img src="../../assets/image/step2.png" alt="" v-else-if="applyStep == 1">
              <img src="../../assets/image/step7.png" alt="" v-else>
          </div>
          <div class="step-list">
              <img src="../../assets/image/step6.png" alt="" v-if="applyStep == 2">
              <img src="../../assets/image/step8.png" alt="" v-else>
              审批通过
          </div>
      </div>
      <!-- 主播信息 -->
      <div class="info" v-if="applyStep == 3 || applyStep == 4">
          <div class="info-title center">
              <p>{{userInfo.nickName}}</p>
              <p>申请主播账号名称</p>
          </div>
          <MyForm ref="myForm" :formConfig="formConfig" @success-request ="success">
            <!-- 请拍摄证件照 -->
            <template v-slot:upload>
              <div class="card">
                <img src="../../assets/image/card.png" alt="">请拍摄证件照
              </div>
            </template>
              <!-- 证件正面 -->
              <template v-slot:idCardZM="{formModel}">
                <div class='img-upload'>
                  <Upload type='2' :extData="{itype: 3}" v-model="formModel['idCardZM']" :uploadStyle="{height: '148px', width: '274px'}"/>
                  <div class="img-upload-info">证件正面</div>
                </div>
              </template>
              <!-- 证件反面 -->
              <template v-slot:idCardFM="{formModel}">
                <div class='img-upload'  style="margin-left:-32px">
                  <Upload type='2' :extData="{itype: 3}" v-model="formModel['idCardFM']" :uploadStyle="{height: '148px', width: '274px'}" />
                  <div class="img-upload-info">证件反面</div>
                </div>
              </template>
              <!-- 手持证件 -->
              <template v-slot:idCardSC="{formModel}">
                <div class='img-upload'  style="margin-left:-64px">
                  <Upload type='2' :extData="{itype: 3}" v-model="formModel['idCardSC']" :uploadStyle="{height: '148px', width: '274px'}"/>
                  <div class="img-upload-info">手持证件</div>
                </div>
              </template>
            <!-- 证件照片例示 -->
            <template v-slot:example>
              <div class="card example">
                <img src="../../assets/image/card.png" alt="">证件照片例示
              </div>
              <div class="img-lists">
                <img src="../../assets/image/fm.png" alt="">  
                <img src="../../assets/image/zm.png" alt="">  
                <img src="../../assets/image/sc.png" alt="">  
              </div>
              <div class="example-bottom">
                <span class="red">*</span>
                <span>温馨提示：请确保姓名与身份证号码真实准备且保持一致，实名认证所上传的身份证照片清晰可见，这可以帮助客服人员快速通过您的申请。</span>
              </div>
            </template>
            <template v-slot:submit>
              <div class="form-submit">
                <el-button type="primary" @click="$refs.myForm.submitForm()">提 交</el-button>
              </div>
            </template>
          </MyForm>
      </div>
      <!-- 主播申请审核中 -->
      <div v-if="applyStep == 1" class="examine">
          <h2>主播申请审核中...</h2>
          <p>运营客服将在您申请之日起3个工作日完成审批，<br>审批通过后将与您电话取得联系，请保持电话畅通~</p>
      </div>
      <!-- 主播申请审核完成 -->
      <div v-if="applyStep == 2" class="examine">
          <h2>恭喜您！审批通过~</h2>
          <p>赶快进入<a href="/#/my/liveset">直播管理</a>，对您的直播间进行设置吧~</p>
      </div>
    </div>
  </div>
</template>

<script>
import MyForm from '@/components/Common/MyForm'
import Upload from '@/components/Upload'
import { apiAddAnchor } from '@/api/live'
import { mapGetters } from 'vuex'
export default {
    components: {
      MyForm,Upload
    },
    computed:{
      ...mapGetters(['applyStep', 'userInfo'])
    },
    methods:{
      success(){ 
        // 提交信息成功
        this.$store.commit('user/SET_APPLYSTEP', 1)
      }
    },
    data(){
      return {
        formConfig: {
          // labelPosition: 'top', // 表单结构位置参数
          httpRequest: apiAddAnchor,
          getFormParams(formData){
            formData.itype = 3 //1.广告2.礼物3.身份证
            if(formData.idCardZM != "" && formData.idCardFM != "" && formData.idCardSC != ""){
              formData.identityImage= formData.idCardZM + '|' + formData.idCardFM + '|' + formData.idCardSC
            }
            delete formData.idCardZM
            delete formData.idCardFM
            delete formData.idCardSC
            return formData
          },
          fieldList: [{
            rows: [{
              cols: [{
                  id: 'realName', label: '真实姓名：'
              }, {
                  id: 'sex', label: '性别：',type:'radio',value:1,options:[{
                    label: 1, value:'男' 
                  }, {
                    label: 2, value: '女'
                  }]
              }]
            }]
          }, 
          {
            rows: [{
              cols: [{
                id: 'cmobileNo', label: '手机号码：', maxlength:"11"
              }, {
                id: 'identityNo', label: '身份证号：', maxlength:"18"
              }]
            }]
          }, 
          {
            rows: [{
                cols: [{
                  id: 'information', label: '个人简介：',type:'textarea',placeholder:"请填写个人简介，比如兴趣爱好、特点专长，50-200个字以内~",maxlength:"200"
                }]
            }]
          },
          {
            rows: [{
              cols: [{
                type: 'slot', id: 'upload'
              }]
            }]
          },
          {
            rows: [{
              cols: [{
                id: 'idCardZM', label: '', type: 'slot'
              }, {
                id: 'idCardFM', label: '', type: 'slot'
              }, {
                id: 'idCardSC', label: '', type: 'slot'
              }]
            }]
          },
          {
            rows: [{
              cols: [{
                type: 'slot', id: 'example'
              }]
            }]
          },
          {
            rows: [{
              cols: [{
                type: 'slot', id: 'submit'
              }]
            }]
          }],
          formRules: {
            realName: [
              { required: true, message: '姓名不能为空', trigger: 'blur' },
              { pattern: /^[\u4e00-\u9fa5]{2,4}$/, message: '请输入正确的真实姓名', trigger: 'blur'}
              // ^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$   可以输入英文 
            ],
            cmobileNo: [
              { required: true, message: '手机号码不能为空', trigger: 'blur' },    
              { pattern: /^1[3-9]\d{9}$/, message: '请输入11位正确的手机号码', trigger: 'blur'}
            ],
            identityNo: [
              { required: true, message: '证件号码不能为空', trigger: 'blur' },
              { pattern: /(^\d{15}$)|bai(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的证件号码', trigger: 'blur'}
            ]
          }
        }
      }
    }
}
</script>

<style lang="scss" scoped>
  .live-apply{
    background: #fff;
    width: 95%;
    margin: 20px auto;
    border-radius:10px;
  }
  .live-apply .content{
      width:980px;
      margin: 0 auto;
  }
  .top-step{
      padding-top: 36px;
      display: -webkit-flex; /* Safari */
      display: flex;
      justify-content: center
  }
  .step-list{
      margin-right:36px;
      img{
        vertical-align: sub;
      }
  }
  .step-list:nth-of-type(2n+1){
      width:78px;
      font-size:16px;
      text-align: center;
      color:#2F3035;
      img{
        // width:39px;
        // height:39px;
        display: block;
        margin:0 auto 10px;
      }
  }
  .card{
    color:#111;
    margin:-12px 0;
    img{
      margin-right:20px;
      vertical-align: sub;
    }
  }
  .img-lists{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    img{
      flex:1;
      margin-right: 25px;
      height:237px;
      border-radius: 6px;
      &:last-of-type{
        margin-right: 0;
      }
    }

  }
  .info{
    margin-top: 36px;
    .info-title{
      margin-bottom: 30px;
      p{
        color:#2F3035;  
        font-size:16px;
      }
      p:nth-of-type(1){
        font-weight: 700;
        font-size:28px ;
        margin-bottom:10px;
      }
    }
  }
  /deep/ .el-textarea__inner{
    height:110px
  }
  .upload-left{
    margin-left: -32px;
  }
  .upload-hadle{
    margin-left: -32px;
  }
  .img-upload-info{
    text-align: center;
    margin-top: -16px;
  }
  // .img-upload{
  //   width:280px;
  //   /deep/ .el-icon-plus,.avatar-uploader-icon{
  //     width:278px;
  //   } 
  //   /deep/ .avatar{
  //     width:278px;
  //   }
  // }
  .example-bottom{
    .red{
      color:red;
      display: inline-block;
      height:100%;
      margin-right:5px;
    }
  }
  .form-submit{
    text-align: center;
    .el-button{
      height: 56px;
      width: 200px;
      background: #41E2BB;
      font-size: 22px;
      font-weight: bold;
      color: #ffffff;
      border:none;
    }
  }
  .center{
      text-align: center;
  }
  .examine{
    margin-top:160px;
    text-align: center;
    padding-bottom:160px;
    h2{
      color:#111111;
      font-size:28px;
      margin-bottom: 36px;
      font-weight:700;
    }
    p{
      line-height: 32px;
      font-size:16px;
      color:#2F3035
    }
    a {
      color: red;
    }
  }
</style>