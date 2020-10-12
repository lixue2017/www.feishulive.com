<!--历史观看-->
<template>
  <div class="subscribe">
    <div class="recommend">
      <div class="title">历史观看</div>
      <MyBox :itemArr="recommend" :xl="6"></MyBox>
      <div class="noData" v-show="recommend.length == 0">还没有历史观看记录~</div>
    </div>
  </div>
</template>

<script>
import MyBox from "@/components/MyBox";
import { apiGetSubscribe } from "@/api/search" // 没有接口，调用我的订阅接口
  export default {
    name: 'Subscribe',
    data(){
      return {
        recommend:[],
      }

    },
    created(){
      this.getSubscribe()
    },
    methods:{
    //   hotNumFn(num) {
    //     if(num < 10000) {
    //       return num
    //     }
    //     return (num/10000).toFixed(1)+"万"
    //   },
      // login() {
      //   this.$store.commit('user/DIALOG_SHOW', true);
      // },
      getSubscribe(){
        apiGetSubscribe().then(res=>{
          res.array.map(key=>{
            key.is_hover = 0
          })
          this.recommend = res.array;
        })
      }
    },
    components: {
      MyBox
    },


  }
</script>

<style lang="scss" scoped>
// .subscribe {
//   height: 100%;
//   padding: 20px;
//   box-sizing: border-box;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   .title {
//     font-size: 24px;
//     color: #111111;
//     margin-bottom: 11px;
//     margin-top: 15px;
//   }
//   .recommend {
//     margin-bottom: 50px;
//     .title { 
//       margin-top: 15px;
//     }
//   }
// }
.subscribe {
  height: 100%;
  padding-right: 100px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .recommend {
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
      margin-bottom: 20px;
      margin-top: 27px;
    }
    /deep/ .box .nav_a {
      box-shadow: 2px 3px 4px 2px rgba(0,0,0,0.22); 
    }
  }
}
.noData{
  text-align: center;
  color:#999;
  padding: 100px 0;
}
</style>