<!--任务中心-->
<template>
    <div class="grade">
        <header-info @edit-nickname="switchComp('UpdateNickname', $event)" />
        <div class="divider" style="display: block;height: 1px;width: 100%;background:#ccc"></div>
        <component :is="dynamicName" v-bind="dynamicData" @goback="switchComp('')"></component>
        <div v-if="!dynamicName" class="bottom-grade">
          <!-- 新手任务 -->
          <div class="grade-list">
            <h2>快速升级</h2>
            <div class="lists">
              <div>
                <div>
                  <img src="../../assets/image/grade/signIn.png" alt="">
                </div>
                <div class="title">每日登录</div>
                <div class="subtitle">直播看起，疯狂拿经验</div>
              </div>
              <div>
                <div>
                  <img src="../../assets/image/grade/subscribe.png" alt="">
                </div>
                <div class="title">订阅主播</div>
                <div class="subtitle">订阅主播，经验轻松得</div>
              </div>
              <div>
                <div>
                  <img src="../../assets/image/grade/gift.png" alt="">
                </div>
                <div class="title">赠送礼物</div>
                <div class="subtitle">赠送礼物，经验嗖嗖嗖</div>
              </div>
              <div>
                <div>
                  <img src="../../assets/image/grade/recharge.png" alt="">
                </div>
                <div class="title">累计充值</div>
                <div class="subtitle">累计充值，经验翻倍，上限更高</div>
              </div>
            </div>
          </div>
          <!-- 日常任务 -->
          <div class="grade-list">
            <h2>等级特权</h2>
            <div class="lists">
              <div>
                <div>
                  <img src="../../assets/image/grade/more.png" alt="">
                </div>
                <div class="title">敬请期待</div>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import HeaderInfo from './components/HeaderInfo'
import UpdateNickname from './components/UpdateNickname'
export default {
  components: {
    HeaderInfo, UpdateNickname
  },
  data(){
    return {
      dynamicData:'',
      dynamicName: ''
    }
  },
  created(){
    
  },
  computed:{

  },
  mounted () {


  },
  methods:{
    switchComp(name, data){
      this.dynamicName = name
      this.dynamicData = data
    }
  }
}
</script>

<style lang="scss" scoped>
  .grade{
    background: #fff;
    width: 95%;
    min-height: 95%;
    margin: 20px auto;
    border-radius: 10px;
    .bottom-grade {
      padding:0 60px 30px;
      .grade-list{
          h2{
            line-height: 60px;
            font-weight:700;
            color:#111;
          }
          .lists {
            display: flex;
            text-align: center;
            flex-wrap: wrap;
            &>div {
              width: 224px;
              margin: 20px 20px 38px 0;
              font-weight: 600;
              .title {
                font-size: 20px;
                color: #111;
                margin: 11px 0;
              }
              .subtitle {
                font-size: 16px;
                color: #999;
              }              
            }
          }
        }
    }
  }
  
</style>