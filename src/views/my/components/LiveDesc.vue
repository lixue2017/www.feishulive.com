<template>
  <div class="live-desc">
    <div class="avatar_desc">
      <div class="avatar">
        <el-avatar :size="120" :src="liveInfo.headImg"></el-avatar>
      </div>
      <div class="desc">
        <div class="nickname">
          昵称：{{ liveInfo.nickName }}
        </div>
        <div class="timer">
          直播时长：{{ secondToDate(liveInfo.liveTime || 0) }}
        </div>
        <div class="number">
          订阅人数：{{ liveInfo.focusNum || 0 }}
        </div>
      </div>
    </div>
    <div class="money">
      <div class="title">
        可提现金额
      </div>
      <div class="gold">
        {{ liveInfo.money || 0 }}元
      </div>
      <div class="tixian">
        <el-button type="primary" @click="handleDrawMoney">去提现</el-button>
      </div>
    </div>
    <div class="action">
      <!-- <div><el-button type="primary">开始直播</el-button></div> -->
      <a :href="'/#/live/detail/'+liveInfo.roomId" target="_blank" style="display: block;"><el-button type="primary">进入房间</el-button></a>
      <!-- <div style="margin-top: 20px"><el-button>进入房间</el-button></div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { apiLiveRoom } from '@/api/user'
export default {
  computed: {
    ...mapGetters(['userInfo'])
  },
  data() {
    return {
      liveInfo: {}
    }
  },
  mounted() {
    this.getLiveRoom()
  },
  methods: {
    //获取直播间信息
    getLiveRoom(){
      apiLiveRoom().then((result)=>{
        this.liveInfo = {
          headImg: result.headImg,
          nickName: result.nickName,
          liveTime: result.liveTime,
          focusNum: result.focusNum,
          money: result.money,
          roomId: result.roomId
        }
        this.$emit('roomdata', result)
      })
    },
    handleDrawMoney() {
      // if(!this.userInfo.bankCard){
      //   return this.$confirm('您还未绑定银行信息,现在去绑定吗?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(()=>{
      //     this.$router.push('/my/live-earn')
      //   })
      // }
      if(!this.userInfo.bankCard){
        return this.$message.warning('您还未绑定银行信息!')
      }
      if(this.liveInfo.money == 0){
        return this.$message.warning('暂无提现金额')
      }
      if(this.liveInfo.money < 100){
        return this.$message.warning('最低提现金额为100元')
      }
      this.$router.push('drawmoney')
    },
    /**
     * 秒转换时分秒
     */
    secondToDate(time){
      var h = Math.floor(time / 3600) < 10 ? '0'+Math.floor(time / 3600) : Math.floor(time / 3600);
      var m = Math.floor((time / 60 % 60)) < 10 ? '0' + Math.floor((time / 60 % 60)) : Math.floor((time / 60 % 60));
      var s = Math.floor((time % 60)) < 10 ? '0' + Math.floor((time % 60)) : Math.floor((time % 60));
      return  h + "时" + m + "分" + s + "秒";
    }
  }
}
</script>

<style lang="scss" scoped>
.live-desc{
  height: 220px;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .avatar_desc{
    display: flex;
    align-items: center;
    .avatar{
      margin-left: 40px;
    }
    .desc{
      margin-left: 60px;
      .nickname{
        line-height: 50px;
        font-size: 24px;
        font-weight: 400;
        color: #111111;
      }
      .timer{
        line-height: 50px;
        font-size: 22px;
        font-weight: 400;
        color: #ccc;
      }
      .number{
        line-height: 50px;
        font-size: 22px;
        font-weight: 400;
        color: #ccc;
      }
    }
  }
  .money{
    .title{
      font-size: 22px;
    }
    .gold{
      color: #FF2F46;
      font-size: 38px;
      font-weight: bold;
    }
    .tixian{
      .el-button{
        font-size: 24px;
      }
    }
  }
  .action{
    margin-right: 40px;
    .el-button--primary{
      font-size: 22px;
    }
    .el-button--default{
      font-size: 22px;
    }
  }
}
</style>