<template>
  <div class="danmuItem" ref="danmuItem" style="opacity: 1; z-index: 0; color: #fff; cursor: auto; font-size: 20px; top: 36px; transform: translateX(-181px);">
    <span class="text">{{msg}}</span>
  </div>
  <!-- <div class="danmu">
    <div>1111111111111111</div>
    <div class="danmuItem" v-for="(item,index) in currentMessageList" :key="index" style="opacity: 1; z-index: 0; color: #fff; cursor: auto; font-size: 20px; top: 36px; transform: translateX(-181px); transition: transform 7.40041s linear 0s;">
      <span class="text">{{item}}</span>
      <span class="text">{{data}}</span>
    </div>
  </div> -->
</template>

<script>
// import { mapState } from 'vuex';
export default {
  data() {
    return {
      msg:"123"
    }
  },
  // computed: {
  //   ...mapState('chat',['currentMessageList'])
  // },
  mounted () {
    var that = this
    setTimeout(()=>{
      that.$refs.danmuItem.remove()
    }, 10000)
  },
}
</script>

<style lang="scss" scoped>
.danmu {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  .danmuItem {
    position: absolute;
    white-space: nowrap;
    pointer-events: none;
    animation: danmu-animation 10s linear;
    .text {
      font-size: 28px;
      font-weight: 600;
      line-height: 46px;
      text-shadow: 0px 4px 0px 4px rgba(0,0,0,0.48); 
    }
  }  
}
@keyframes danmu-animation
{
0%   {left:100%;transform: translateX(0px);}
100% {left: 0;}
}

@-moz-keyframes danmu-animation /* Firefox */
{
0%   {left:100%;transform: translateX(0px);}
100% {left: 0;}
}

@-webkit-keyframes danmu-animation /* Safari 和 Chrome */
{
0%   {left:100%;transform: translateX(0px);}
100% {left: 0;}
}

@-o-keyframes danmu-animation /* Opera */
{
0%   {left:100%;transform: translateX(0px);}
100% {left: 0;}
}
</style>