<template>
  <div class="live-earn">
    <live-desc />
    <div class="content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="礼物记录" name="gift" lazy>
          <div class="query">
            <el-date-picker
              v-model="gift.query"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
            <el-button type="primary" class="query-btn" @click="$refs.giftTableRef.refreshTable()">查询</el-button>
          </div>
          <my-table ref="giftTableRef" :columnConfig="gift.columnConfig" :httpRequest="gift.httpRequest" :getQueryParams="gift.getQueryParams"></my-table>
        </el-tab-pane>
        <el-tab-pane label="粉丝贡献" name="fans" lazy>
          <div class="fans_tbar">
            <el-radio-group v-model="fans.timeType" @change="$refs.fansTableRef.refreshTable()">
              <el-radio-button label="1">今日</el-radio-button>
              <el-radio-button label="3">昨日</el-radio-button>
              <el-radio-button label="2">本周</el-radio-button>
              <el-radio-button label="4">总览</el-radio-button>
            </el-radio-group>
          </div>
          <my-table ref="fansTableRef" :indexColumn="{label: '排名',show: true}" :columnConfig="fans.columnConfig" :httpRequest="fans.httpRequest" :getQueryParams="fans.getQueryParams"></my-table>
        </el-tab-pane>
        <el-tab-pane label="银行卡信息" style="margin-top: 25px;" name="bank" lazy>
          <el-row :gutter="20">
            <el-col :span="2" style="height:1px"></el-col>
            <el-col :span="20">
              <my-form class="bank-form" ref="myForm" :formConfig="bank.formConfig" @before-request="bank.isLoading=true" @complete-request="bank.isLoading=false">
                <!-- 持卡人姓名 tip slot -->
                <template v-slot:real_name>
                  <div class="real_name">
                    请提供主播本人的银行卡，仅支持中文姓名
                  </div>
                </template>
                <!-- 身份证号码 tip slot -->
                <template v-slot:id_card>
                  <div class="id_card">
                    请输入18位身份证证件，要求与银行卡绑定的证件号码一致
                  </div>
                </template>
                <!-- 开户行 slot -->
                <template v-slot:bankName="{formModel, selectAll, disableAll}" >
                  <el-row type="flex" justify="space-between" :gutter="10">
                    <el-col>
                      <el-select v-model="formModel['bankName']" :disabled="disableAll.bankName" style="width:100%">
                        <el-option v-for="selectItem in selectAll['bankName']" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"/>
                      </el-select>
                    </el-col>
                    <el-col>
                      <el-input v-model="formModel['bankDetails']" :disabled="disableAll.bankDetails" placeholder="请输入开户行支行" />
                    </el-col>
                  </el-row>
                </template>
                <!-- 银行卡号 tip slot -->
                <template v-slot:bank_card>
                  <div class="bank_card">
                    请输入16-19位银行卡号，只支持国内银行借记卡
                  </div>
                </template>
                <!-- 身份证 -->
                <template v-slot:identityImage="{formModel,disableAll}">
                  <!-- <div style="display: flex">
                    <el-avatar shape="square" style="margin: 0 8px 8px 0" :size="148" :src="formModel['original_idcardurl']"></el-avatar>
                  </div> -->
                  <Upload type="2" :uploadStyle="{height: '151px', width: '240px'}" v-model="formModel['identityImage']" :disabled="disableAll.bankDetails" />
                  <div>
                    照片清晰，支持PNG、JPG大小1M内
                  </div>
                </template>
                <!-- 银行卡 -->
                <template v-slot:bankImage="{formModel,disableAll}">
                  <!-- <div style="display: flex">
                    <el-avatar shape="square" style="margin: 0 8px 8px 0" :size="148" :src="formModel['original_bankurl']"></el-avatar>
                  </div> -->
                  <Upload type="2" :uploadStyle="{height: '151px', width: '240px'}" v-model="formModel['bankImage']" :disabled="disableAll.bankDetails" />
                  <div>
                    银行卡号显示清晰，照片大小1M以内，支持PNG、JPG
                  </div>
                </template>
                <!-- 表单提交 -->
                <template v-slot:form-submit>
                  <div class="form-submit" v-if="!isUpdate">
                    <el-button type="primary" @click="$refs.myForm.submitForm()" v-loading="bank.isLoading">提 交</el-button>
                  </div>
                  <div class="form-submit" v-if="isUpdate">
                    <el-button type="primary" @click="handleUpdate(false)" v-loading="bank.isLoading">修 改</el-button>
                  </div>
                </template>
              </my-form>
            </el-col>
            <el-col :span="2" style="height:1px"></el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="提现记录" style="margin-top: 20px;" name="takemoney" lazy>
          <my-table :columnConfig="takeMoney.columnConfig" :httpRequest="takeMoney.httpRequest"></my-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import MyForm from '@/components/Common/MyForm'
import MyTable from '@/components/Common/MyTable'
import LiveDesc from './components/LiveDesc'
import Upload from '@/components/Upload'
import { apiGiftList, apiFansList, apiTakeMoneyList, apiQueryBank, apiEditBank } from '@/api/user'
import { parseTime } from '@/utils'

export default {
  components: {
    MyForm, MyTable, Upload, LiveDesc,
  },
  data(){
    const pageThat = this
    return {
      isUpdate: true,
      activeName: 'gift',
      //礼物记录
      gift: {
        query: '',
        httpRequest: apiGiftList,
        getQueryParams: ()=>{
          let query = this.gift.query
          if(query){
            return {
              startDate: parseTime(query[0], '{y}-{m}-{d}'),
              endDate: parseTime(query[1], '{y}-{m}-{d}')
            }
          }else {
            return {}
          }
        },
        columnConfig: [{
          prop: 'addDate', label: '赠送日期'
        }, {
          prop: 'nickName', label: '赠送用户'
        }, {
          prop: 'giftName', label: '礼物名称'
        }, {
          prop: 'giftProfit', label: '礼物收益'
        }]
      },
      //粉丝贡献
      fans: {
        timeType: '1',
        httpRequest: apiFansList,
        getQueryParams: ()=>{
          return {type: this.fans.timeType}
        },
        columnConfig: [{
          prop: 'nickname', label: '用户昵称'
        }, {
          prop: 'level', label: '等级'
        }, {
          prop: 'giftprice', label: '贡献值'
        }]
      },
      //银行卡信息
      bank: {
        isLoading: false,
        formConfig: {
          labelPosition: 'top',
          httpRequest: apiEditBank,
          successMessage: '银行卡信息录入成功',
          successFunction: this.handleUpdate,
          afterMounted(){
            apiQueryBank().then((result)=>{
              let _formModel = {
                realName: result.realName,
                idCard: result.idCard,
                bankName: result.bankName,
                bankDetails: result.bankDetails,
                bankCard: result.bankCard,
                identityImage: result.identityImage,
                original_idcardurl: result.identityImage,
                bankImage: result.bankImage,
                original_bankurl: result.bankImage
              }
              this.setFormModel(_formModel)
              result.realName && (pageThat.handleUpdate())
            })
          },
          fieldList: [{
            rows: [{
              cols: [{
                id: 'realName', label: '持卡人姓名', tip: 'real_name'
              }, {
                id: 'idCard', label: '身份证号码', tip: 'id_card', maxlength: 18
              }]
            }]
          }, {
            rows: [{
              cols: [{
                id: 'bankName', label: '开户行', type: 'slot', options: [{
                  label: '中国银行', value: '中国银行'
                }, {
                  label: '中国工商银行', value: '中国工商银行'
                }, {
                  label: '中国农业银行', value: '中国农业银行'
                }, {
                  label: '中国建设银行', value: '中国建设银行'
                }, {
                  label: '交通银行', value: '交通银行'
                }]
              },{
                id: 'bankCard', label: '银行卡号', tip: 'bank_card', maxlength: 19
              }]
            }]
          }, {
            rows: [{
              cols: [{
                id: 'identityImage', label: '上传身份证正面照片', type: 'slot'
              }, {
                id: 'bankImage', label: '上传银行卡正面照片', type: 'slot'
              }]
            }]
          }],
          formRules: {
            realName: [
              { required: true, message: '持卡人姓名不能为空', trigger: 'blur' },
              { pattern: /^[\u4e00-\u9fa5]+$/, message: '请输入您的中文姓名' }            
            ],
            idCard: [
              { required: true, message: '身份证号码不能为空', trigger: 'blur' },
              { pattern: /^[0-9,X,x]+$/, message: '请输入18位有效身份证号码' },
              { min: 18, max: 18, message: '请输入18位有效身份证号码' }
            ],
            bankName: [
              { required: true, message: '开户行', trigger: 'blur' },
              { pattern: /^[\u4e00-\u9fa5]+$/, message: '请输入中文开户行名称' }
            ],
            bankCard: [
              { required: true, message: '银行卡号不能为空', trigger: 'blur' },
              { pattern: /^[0-9]+$/, message: '请输入16-19位有效银行卡号' },
              { min: 16, max: 19, message: '请输入16-19位有效银行卡号' }
            ]
          },
          formModel: {
            bankDetails: '', //支行
            original_idcardurl: '', //静态身份证url
            original_bankurl: ''  //静态银行卡url
          }
        }
      },
      //提现记录
      takeMoney:{
        httpRequest: apiTakeMoneyList,
        columnConfig: [{
          prop: 'addDate', label: '提现日期'
        }, {
          prop: 'money', label: '提现金额'
        }, {
          prop: 'success', label: '提现状态', render: function(row, column, cellValue){
            let data = {
              0: {
                text: '未处理',
                color: 'color:#FF071C'
              },
              1: {
                text: '提款成功',
                color: 'color:#01B875'
              },
              2: {
                text: '拒绝提款',
                color: 'color:#2F3035'
              },
              3: {
                text: '银行处理失败',
                color: 'color:#2F3035'
              },
              4: {
                text: '银行复批中',
                color: 'color:#FF071C'
              }
            }
            // let data = ['未处理', '提款成功', '拒绝提款', '银行处理失败', '银行复批中']
            function more() {
              pageThat.handleDetail(row.memo)
            }
            return <div style={data[cellValue].color}>{data[cellValue].text}<div class="take-money-more" onClick={more}><img src={require('@/assets/image/my/more.png')}/></div></div>
          }
        }]
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  methods: {
    handleUpdate(isDisable=true) {
      this.isUpdate = isDisable;
      let bankForm = this.$refs.myForm
      bankForm.disableAll.realName = isDisable
      bankForm.disableAll.idCard = isDisable
      bankForm.disableAll.bankName = isDisable
      bankForm.disableAll.bankCard = isDisable
      bankForm.disableAll.bankDetails = isDisable
    },    
    handleDetail(text) {
      if(!text) text='暂无备注'
      this.$confirm(text, "备注", {
        confirmButtonText: "确定",
        customClass: "confirm-detail",
        center: true,
        showClose: false,
        showCancelButton: false
      })
    }
  },
}
</script>

<style lang="scss">
  .confirm-detail {
    width: 502px;
    .el-message-box__title {
      font-size: 30px;
      color: #111;
    }
    .el-message-box__content {
      font-size: 22px;
      color: #333;
      padding: 30px 0 40px;
    }
    .el-button {
      font-size: 22px;
      width: 140px;
      height: 50px;
      border-radius: 8px;
    }
  }
</style>

<style lang="scss" scoped>
.live-earn{
  width: 95%;
  border-radius: 10px;
  margin: 20px auto;
  // /deep/ .el-tabs__item {
  //   padding: 0 75px;
  // }
  .content{
    margin-top: 25px;
    background: #fff;
    border-radius: 10px;
    padding: 30px 50px 20px 50px;
    /deep/ .el-tabs__active-bar {
      height: 4px;
    }
    /deep/ .el-tabs__item{
      height: 52px;
      font-size: 26px;
      color: #666;
      &.is-active {
        color: #42EDC4; 
      }
    }

    /deep/ .el-table{
      border-radius: 10px;
      .el-table__header th{
        font-size: 24px;
        background: #111111;
        color: #fff;
      }
      .el-table__body td{
        font-size: 22px;
        color: #2f3035;
        background: #dcdcdc;
        .el-button{
          font-size: 22px;
        }
      }
      .el-table__body tr.el-table__row--striped td {
        background: #e9e9e9;
      }
      .take-money-more {
        position: absolute;
        top: 50%;
        right: 15%;
        transform: translateY(-50%);
        cursor: pointer;
        img {
          display: block;
        }
      }
    }
    .fans_tbar{
      margin-bottom: 20px;
      text-align: center;
      /deep/ .el-radio-group{
        .el-radio-button__inner{
          font-size: 24px;
          width: 200px;
        }
      }
    }
    .query{
      margin-bottom: 20px;
      .query-btn{
        margin-left: 20px;
      }
    }

    .bank-form{
      /deep/ .el-form-item__label{
        font-size: 20px;
        font-weight: bold;
      }

      .form-submit{
        margin-top: 20px;
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
}
</style>