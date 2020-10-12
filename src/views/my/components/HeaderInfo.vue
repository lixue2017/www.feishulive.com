<template>
  <div class="myinfo">
    <div class="content">
      <!-- <el-avatar :size="120" :src="userInfo.head"></el-avatar> -->
      <Upload type="3" shape="circle" url="my/editorImgUrl" :extData="uploadExtData" :uploadStyle="{height: '120px', width: '120px'}" v-model="avatarUrl" @upload-success="uploadSuccess" />
      <div class="info">
        <div class="nickname">
          <span>{{ userInfo.nickName }}</span>
          <img class="info-img" :src="require('@/assets/image/edit_avatar.png')" @click="handleEditNickName" />
          <span class="level">
            <img :src="require('@/assets/image/login/ico_level.png')" alt="">
            <span>lv{{userLevel.ilevel}}</span>
          </span>
          <img :src="require('@/assets/image/my/cmedal'+item+'.png')" :title="cmedalTitle[item]" alt="" class="cmedal" v-for="(item,index) in cmedal" :key="index">
          <!-- <img :src="require('@/assets/image/my/cmedal2.png')" alt="" v-if="userInfo.cmedal" class="cmedal">
          <img :src="require('@/assets/image/my/cmedal3.png')" alt="" v-if="userInfo.cmedal" class="cmedal"> -->
        </div>
        <div class="experience" v-if="userLevel.ivalue"><span>经验值:</span><el-progress :text-inside="true" :stroke-width="20" :percentage="experienceFn()" color="#42EDC4"></el-progress></div>
        <div class="gift">
          <div class="cheese">
            <img :src="require('@/assets/image/cheese.png')" />
            <span>奶酪：{{ toWan(userInfo.userAcct && userInfo.userAcct.giftNum || 0) }}</span>
          </div>
          <div class="gold">
            <img :src="require('@/assets/image/gold.png')" />
            <span>金币：{{ toWan(userInfo.userAcct && userInfo.userAcct.goldCoin || 0) }}</span>
          </div>
          <div class="topup">
            <el-button type="primary" round size="mini" @click="$store.commit('user/RECHARGE_SHOW', true);">充值</el-button>
          </div>
        </div>
      </div>
      <div class="want_live">
        <el-button v-if="applyStep!==2" type="primary" @click="$router.push('apply-anchor')">我要直播</el-button>
        <el-button v-else type="primary" @click="handleEnterRoom">进入直播间</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Upload from '@/components/Upload'
import { mapGetters } from 'vuex'
import { apiUserLevel, apiExchangeList , apiCZModeList , apiPayLink, apiSearch, apiLiveRoom} from '@/api/user'
export default {
  components: {
    Upload,
  },
  data(){
    return {
      cmedalTitle: ['一掷千金勋章','王者加冕勋章','守护使者勋章'],
      cmedal: [],
      avatarUrl: '',
      uploadExtData: {apipkg: "live_h5",appVersion: "1.0",channel: "live_h5",osName: "h5"}

    }
  },
  computed: {
    ...mapGetters(['userInfo', 'userLevel', 'applyStep'])
  },
  watch:{
    'userInfo.head':{
      deep: true,
      handler: function(newValue, oldValue){
        this.avatarUrl = newValue
      }
    },
    'userInfo.cmedal'(val) {
      if(val) {
        this.cmedal = val.split(",")
      }      
    }

  },
  mounted () {
    if(this.userInfo){
      this.avatarUrl = this.userInfo.head
      if(this.userInfo.cmedal) {
        this.cmedal = this.userInfo.cmedal.split(",")
      }      
    }
  },
  methods: {
    uploadSuccess(url){
      this.$store.commit('user/SET_USER_HEAD', url)
    },
    experienceFn() {
      return parseFloat(((this.userLevel.exp/this.userLevel.ivalue)*100).toFixed(1))
      // return this.userLevel.exp == 0?0:Math.floor(this.userLevel.ivalue / this.userLevel.exp * 10) / 10
    },
    toWan(number) {
      if(number > 10000){
        return Math.floor(number / 10000 * 10) / 10 + '万'
      }
      return number
    },
    /**
     * 修改用户昵称
     */
    handleEditNickName(){
      this.$emit('edit-nickname', {nickName: this.userInfo.nickName})
    },
    /**
     * 进入直播间
     */
    handleEnterRoom(){
      apiLiveRoom().then((result)=>{
        this.$router.push(`/live/detail/${result.roomId}`)
      })
    }
  }  
}
</script>

<style lang="scss" scoped>
  .myinfo{
    margin: 0 auto;
    padding: 0 5%;
    height: 225px;
    // border-bottom: 1px solid #ccc;
    .content{
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .edit{
        background: darkblue;
        width: 120px;
        height: 120px;
        border-radius: 50%;
      }
      .info{
        margin-left: 30px;
        flex: 1;
        .nickname{
          line-height: 50px;
          font-size: 24px;
          font-weight: 400;
          color: #111111;
          .info-img{
            margin: 0 20px 0 6px;
            cursor: pointer;
          }
          .level {
            display: inline-block;
            line-height: 27px;
            background: #57c797;
            border-radius: 5px;
            padding: 0 6px;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            vertical-align: middle;
            span {
              display: inline-block;
              margin-left: 3px;
            }
            img, span {
              vertical-align: middle;
              opacity: 0.9;
            }
          }
          .cmedal {
            margin-left: 10px;
            vertical-align: middle;
          }
        }
        .experience{
          line-height: 50px;
          font-size: 18px;
          font-weight: 600;
          color: #666666;
          .el-progress{
            margin-left: 10px;
            display: inline-block;
            width: 300px;
          }
        }
        .gift{
          line-height: 50px;
          display: flex;
          font-size: 18px;
          font-weight: 600;
          color: #666666;
          .cheese{
            img{
              vertical-align: sub;
            }
            span{
              margin-left: 12px;
            }
          }
          .gold{
            margin-left: 30px;
            img{
              vertical-align: sub;
            }
            span{
              margin-left: 12px;
            }
          }
          .topup{
            margin-left: 30px;
            .el-button{
              width: 100px;
              font-size: 18px;
              font-weight: 600;
            }
          }
        }
      }
      .want_live{
        .el-button{
          font-size: 22px;
          font-weight: bold;
        }
      }
    }
  }
</style>