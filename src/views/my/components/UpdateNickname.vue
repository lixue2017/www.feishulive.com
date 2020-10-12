<template>
  <div class="nickname">
    <div class="content">
      <div class="curr_nickname">
        <label>当前昵称</label>
        <span>{{ this.nickName }}</span>
      </div>
      <div class="expense">
        <label>本次修改需花费</label>
        <span>{{updateModify}}金币</span>
      </div>
      <my-form ref="myForm" :formConfig="formConfig">
        <template v-slot:form-submit>
          <div class="form-submit">
            <el-button type="primary" @click="$refs.myForm.submitForm()" v-loading="isLoading">提 交</el-button>
            <el-button @click="$emit('goback')">取 消</el-button>
          </div>
        </template>
      </my-form>
    </div>
    <div class="hint">
      <div>
        <div class="title">
          修改规则：
        </div>
        <div>
          1.每人拥有一次免费修改机会，往后按修改次数对于收取费用；<br/>
          2.昵称长度建议在6-8个汉字为佳，最长长度不超过20个字符；<br/>
          3.昵称输入仅支持汉字、字母、数字及符号；<br/>
          4.昵称修改成功后，若经人工审核违规将被重置，且涉及费用不予退还。
        </div>
      </div>
      <div style="margin-left: 70px">
        <div class="title">
          温馨提示：
        </div>
        <div>
          第1次修改昵称免费；<br/>
          第2次修改昵称 <span style="color:#42EDC4">100</span> 金币；<br/>
          第3次修改昵称 <span style="color:#42EDC4">1000</span> 金币；<br/>
          以后每次修改昵称需要 <span style="color:#42EDC4">5000</span> 金币。
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyForm from '@/components/Common/MyForm'
import { apiSetUpdateModify, apiUpdateNickName } from '@/api/user'
import { mapMutations, mapGetters } from 'vuex'
import { apiVerificationNickName } from '@/api/base'
export default {
  components: {
    MyForm,
  },
  props: {
    nickName: String
  },
  data(){    
    let validateName = (rule, value, callback) => {
      apiVerificationNickName({nickName:value}).then((res)=>{
        if(res.exist) {
          callback(new Error('昵称已被占用!'));
        } else {
          callback()
        }          
      })   
    };
    return {
      isLoading: false,
      dialogVisible: false,
      updateModify: 0,
      formConfig: {
        labelWidth: '130px',
        httpRequest: apiUpdateNickName,
        confirm: this.confirm,
        successMessage: '昵称修改成功',
        successFunction: this.submitSuccess,
        fieldList: [{
          rows: [{
            cols: [{
              id: 'nickName', label: '新昵称', maxlength: 6
            }]
          }]
        }],
        formRules: {
          nickName: [
            { required: true, message: '昵称不能为空', trigger: 'blur' },
            { min:1, message: '昵称长度需为1-6个字符', trigger: 'blur' },
            { validator: validateName, trigger: 'blur' }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    apiSetUpdateModify().then((res)=>{
      this.updateModify = res.spendMoney
    })
  },
  methods: {
    ...mapMutations('user', ['SET_USERINFOBYKEY']),
    submitSuccess() {
      let formModel = this.$refs.myForm.formModel
      this.SET_USERINFOBYKEY({key: 'nickName', value: formModel.nickName})
      this.userInfo.userAcct.goldCoin -= this.updateModify
      // this.SET_USERINFOBYKEY({key: 'userAcct.goldCoin', value: -updateModify})
      // this.$parent.switchComp('Encrypt')
      this.$emit('goback')
    },
    confirm() {
      return this.$confirm(`<div class="updateModify"><img src="${require('@/assets/image/gold.png')}" alt="" width="32px"><span>${this.updateModify}金币</span></div>`, '点击确定按钮，系统将扣除修改昵称的费用', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        customClass: 'username-confirm',
        center: true,
        dangerouslyUseHTMLString: true,
        showClose: false,
        cancelButtonClass: 'cancelBtn',
        confirmButtonClass: 'confirmBtn'
      })
    }
  }
}
</script>

<style lang="scss">
  .username-confirm {
    width: 502px;
    .el-message-box__title {
      font-size: 22px;
      margin: 10px 0;
      color: #111
    }
    .updateModify {
      font-size: 32px;
      text-align: center;
      img,span {
        display: inline-block;
        vertical-align: middle;
      }
      span {
        color: #FF3758;
        margin-left: 15px;
      }
    }
    .el-message-box__btns {
      overflow: hidden;
      padding-top: 28px;
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
.nickname{
  width: 1200px;
  margin: 0 auto;
  padding-top: 25px;
  padding-bottom: 25px;
  padding-left: 140px;
  box-sizing: border-box;
  .content{
    width: 520px;
    .curr_nickname, .expense{
      margin-bottom: 15px;
      line-height: 40px;
      label{
        box-sizing: border-box;
        display: inline-block;
        font-size: 16px;
        font-weight: 600;
        color: #545454;
        width: 130px;
        text-align: right;
        padding-right: 12px;
      }
      span{
        font-size: 16px;
        font-weight: 600;
        color: #0be4b0;
      }
    }
    .form-submit{
      .el-button{
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
  .hint{
    display: flex;
    margin-top: 150px;
    margin-bottom: 60px;
    font-size: 16px;
  }
}
</style>