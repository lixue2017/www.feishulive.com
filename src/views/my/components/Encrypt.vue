<template>
  <div class="encrypt">
    <div class="mobile_bind">
      <div class="icon"><img :src="require('@/assets/image/mobile.png')" /></div>
      <div class="text">
        <div class="title">绑定手机</div>
        <div class="desc">您绑定的手机号码为：{{hideMobileNo(this.userInfo.mobileNo)}}</div>
      </div>
      <div class="action"><el-button type="primary" plain round size="mini" @click="handleBindMobile">更换绑定</el-button></div>
    </div>
    <el-divider direction="vertical"></el-divider>
    <div class="set_pwd">
      <div class="icon"><img :src="require('@/assets/image/lock.png')" /></div>
      <div class="text">
        <div class="title">设置密码</div>
        <div class="desc">设置您的密码保障账号安全</div>
      </div>
      <div class="action"><el-button type="primary" plain round size="mini" @click="handleSetPwd">{{userInfo.pwState?'修改密码':'立即设置'}}</el-button></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Encrypt',
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    handleBindMobile() {
      this.$parent.switchComp('BindMobile', {mobileNo: this.userInfo.mobileNo})
    },
    handleSetPwd(){
      this.$parent.switchComp('SetPwd')
    },
    hideMobileNo(mobileNo){
      return mobileNo && mobileNo.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
    }
  }
}
</script>

<style lang="scss" scoped>
.encrypt{
  width: 100%;
  margin: 0 auto;
  padding-left: 5%;
  padding-top: 42px;
  padding-bottom: 90px;
  display: flex;
  box-sizing: border-box;
  .mobile_bind, .set_pwd{
    display: flex;
    justify-content: center;
    align-items: center;
    .text{
      margin-left: 20px;
      .title{
        font-size: 18px;
        font-weight: 600;
        color: #111111;
      }
      .desc{
        font-size: 16px;
        font-weight: 600;
        color: #666666;
      }
    }
    .action{
      margin-left: 32px;
      .el-button{
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
  .el-divider{
    height: 2em;
    margin: 0 40px;
  }
}
</style>