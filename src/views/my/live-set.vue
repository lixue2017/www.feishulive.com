<template>
  <div class="live-set">
    <live-desc @roomdata="initRoomData" ref="live-desc"/>
    <div class="form-region">
      <MyForm ref="myForm" :formConfig="formConfig" @before-request="isLoading=true" @complete-request="isLoading=false">
        <!-- RTMP地址 slot -->
        <template v-slot:rtmp_url="{formModel}">
          <div class="rtmp_url">
            <i class="el-icon-copy-document" @click="clip(formModel.rtmpUrl, $event)"></i>
          </div>
        </template>
        <!-- 直播码 slot -->
        <template v-slot:push_url="{formModel}">
          <div class="push_url">
            <i class="el-icon-refresh-right" @click="handleRefreshPush"></i>
            <i class="el-icon-copy-document" @click="clip(formModel.pushUrl, $event)"></i>
          </div>
        </template>
         <!-- 直播类型 slot -->
        <template v-slot:roomType="{formModel, selectAll, disableAll}" >
          <el-row type="flex" justify="space-between" :gutter="10">
            <el-col>
              <el-select v-model="formModel['roomType']" @change="handleLiveDomain" style="width:100%" :disabled="disableAll['roomType']">
                <el-option v-for="selectItem in selectAll['roomType']" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"/>
              </el-select>
            </el-col>
            <el-col>
              <el-select v-model="formModel['roomDomain']" style="width:100%" :disabled="disableAll['roomDomain']">
                <el-option v-for="selectItem in selectAll['roomDomain']" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"/>
              </el-select>
            </el-col>
          </el-row>
        </template>
        <!-- 房间封面图 竖屏 -->
        <template v-slot:cpicurl="{formModel,disableAll}">
          <el-row type="flex" justify="space-between" :gutter="10">
            <el-col>
              <div>
                <Upload v-model="formModel['original_imgUrl']" type="2" :uploadStyle="{width:'300px', height:'200px'}" :disabled="disableAll.cpicurl"/>
                <div style="width:300px;text-align:center;color:#909399">上传横屏封面</div>
              </div>
            </el-col>
            <el-col>
              <div>
                <Upload v-model="formModel['cpicurl']" type="2" :uploadStyle="{width:'200px', height:'300px'}" :disabled="disableAll.cpicurl" />
                <div style="width:200px;text-align:center;color:#909399">上传竖屏封面</div>
              </div>
            </el-col>
          </el-row>
        </template>
        <template v-slot:form-submit>
          <div class="form-submit" v-if="!isUpdate">
            <el-button type="primary" @click="handleSubmit" v-loading="isLoading">提 交</el-button>
          </div>
          <div class="form-submit" v-if="isUpdate">
            <el-button type="primary" @click="handleUpdate(false)" v-loading="isLoading">修 改</el-button>
          </div>
        </template>
      </MyForm>
    </div>
  </div>
</template>

<script>
import LiveDesc from './components/LiveDesc'
import MyForm from '@/components/Common/MyForm'
import Upload from '@/components/Upload'
import { apiLiveType, apiLiveDoman, apiLiveRoom, apiSaveLiveRoom, apiRefreshLivePush } from '@/api/user'
import clip from '@/utils/clipboard'
export default {
  components: {
    LiveDesc, MyForm, Upload
  },
  data(){
    return {
      isLoading: false,
      isUpdate: true,
      formConfig: {
        labelWidth: '150px',
        httpRequest: apiSaveLiveRoom,
        // successMessage: '操作成功',
        successFunction(){
          this.formModel.original_cpicurl = this.formModel.cpicurl
          this.formModel.original_imgUrl = this.formModel.imgUrl
        },
        afterMounted(){
          //初始化roomDomain
          this.$set(this.formModel, 'roomDomain', '')
          apiLiveType().then((result)=>{
            this.$set(this.selectAll, 'roomType', result.liveType.map((item)=>{
              return {value: item.id,label: item.name}
            }))
          })
        },
        getFormParams(formData){
          //RTMP地址和直播码不需要提交给后端
          formData.imgUrl = formData.original_imgUrl
          delete formData.rtmpUrl
          delete formData.pushUrl
          delete formData.original_cpicurl
          delete formData.original_imgUrl
          if(parseInt(formData.uCount)) {
            delete formData.roomType
            delete formData.roomDomain
          }
          return formData
        },
        fieldList: [{
          rows: [{
            cols: [{
              id: 'rtmpUrl', label: 'RTMP地址', tip: 'rtmp_url', disable: true
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'pushUrl', label: '直播码',tip: 'push_url', disable: true
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'roomType', type: 'slot', label: '直播类型'
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'roomTitle', label: '房间标题'
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'roomNotice', label: '房间公告', type: 'textarea', rows: 4
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'introduce', label: '主播简介', type: 'textarea', rows: 4
            }]
          }]
        }, {
          rows: [{
            cols: [{
              id: 'cpicurl', label: '房间封面图', type: 'slot'
            }]
          }]
        }],
        formModel: {
          original_cpicurl: '',
          original_imgUrl: '',
          uCount: 0
        },        
        formRules: {
          roomType: [{ required: true, message: '直播类型不能为空', trigger: 'blur' }],
          roomDomain: [{ required: true, message: '直播领域不能为空', trigger: 'blur' }],
        }
      }
    }
  },
  methods: {
    clip,
    initRoomData(result){
      let _formModel = {
        rtmpUrl: result.pushUrl.split("/live/")[0] + "/live/",
        pushUrl: result.pushUrl.split("/live/")[1],
        roomTitle: result.roomTitle,
        roomNotice: result.gonggao,
        roomType: result.itype?result.itype + '':'',
        roomDomain: result.idomain?result.idomain + '':'',
        introduce: result.introduce,
        imgUrl: result.imgUrl,
        original_imgUrl: result.imgUrl,//用于展示原始图片
        cpicurl: result.cpicurl,
        original_cpicurl: result.cpicurl, //用于展示原始图片
        uCount: result.uCount
      }

      this.$refs.myForm.setFormModel(_formModel)
      //第一次手动获取直播领域
      this.handleLiveDomain(_formModel.roomType, false)
      parseInt(result.uCount) && this.handleDisable()
      parseInt(result.uCount) && this.handleUpdate()
      !parseInt(result.uCount) && this.handleUpdate(false)
    },
    handleUpdate(isDisable=true) {
      this.isUpdate = isDisable;
      let _formModel = this.$refs.myForm
      _formModel.disableAll.roomTitle = isDisable
      _formModel.disableAll.roomNotice = isDisable
      _formModel.disableAll.introduce = isDisable
      _formModel.disableAll.imgUrl = isDisable
      _formModel.disableAll.cpicurl = isDisable
    },  
    handleDisable() {
      let _formModel = this.$refs.myForm
      _formModel.disableAll.roomType = true
      _formModel.disableAll.roomDomain = true
    },
    handleRefreshPush(){
      apiRefreshLivePush().then((result)=>{
        this.$refs["live-desc"].getLiveRoom()     
      })
    },
    //获取直播领域
    handleLiveDomain(val, clear = true) {
      let myForm = this.$refs.myForm
      if(clear === true){
        myForm.formModel.roomDomain = ''
      }
      if(val) {
        apiLiveDoman({categoryId: val}).then((result)=>{
          myForm.$set(myForm.selectAll, 'roomDomain', result.map((item)=>{
            return {value: item.id,label: item.name}
          }))
        })
      }      
    },
    //提交主播信息
    handleSubmit(){
      this.$refs.myForm.submitForm()
    }
  }
}
</script>

<style lang="scss" scoped>
.live-set{
  width: 95%;
  border-radius: 10px;
  margin: 20px auto;
  .form-region{
    margin-top: 30px;
    padding-top: 25px;
    padding-bottom: 90px;
    padding-right: 200px;
    background-color: #fff;
    border-radius: 10px;
    .rtmp_url{
      font-size: 20px;
      position: absolute;
      top: 0;
      right: -30px;
    }
    .push_url{
      font-size: 20px;
      position: absolute;
      top: 0;
      right: -65px;
      :not(:first-child){
        margin-left: 15px;
      }
    }
    .form-submit{
      text-align: center;
      .el-button{
        height: 60px;
        width: 230px;
        font-size: 24px;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
}
</style>