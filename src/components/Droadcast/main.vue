<template>
  <div class="danmuItem" ref="danmuItem" :style="itemStyle+' top:'+positionStyle.top">
    <img :src="require('@/assets/image/default_icon.png')" v-real-img="sendImg" alt="">
    <a :href="'/#/live/detail/'+roomId" target="_blank"><span>{{userName}}</span> 赠送给 <span>{{anchorName}}</span> {{giftNum}}个{{giftName}}，快来围观吧～～</a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      itemStyle: "",
      verticalOffset: 16,
      onClose: null,
      duration: 10000,
      timer: null
    }
  },
  computed: {
    positionStyle() {
      return {
        'top': `${ this.verticalOffset }px`
      };
    }
  },
  mounted () {
    let that = this
    this.$nextTick(function() {      
      let w = this.$refs.danmuItem.offsetWidth
      this.itemStyle= "z-index: 1; transform: translateX(-"+w+"px);transition: transform 10s linear 0s;"
    })
    this.startTimer();
  },
  methods: {
    close() {
      this.closed = true;
      if (typeof this.onClose === 'function') {
        this.onClose(this, this.userOnClose);
        this.$refs.danmuItem.remove()
      }
    },
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
    },
    userOnClose(el) {
      el.remove()
    }
  },
}
</script>
<style lang="scss">  
.danmu {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 48px);
  z-index: 1002;
}
</style>
<style lang="scss" scoped>
.danmuItem {
  width: 85%;
  max-width: 861px;
  height: 18%;
  max-height: 90px;
  position: absolute;
  white-space: nowrap;
  animation: danmu-animation 10s linear;
  font-size: 20px;
  background-image: url(../../assets/image/detail/gift_danmu_bg.png);
  background-size: 100%;
  background-position: center;
  img {
    position: absolute;
    width: 6%;
    height: 58%;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    margin-left: 2.2%;
  }
  a {
    color: #fff;
    font-size: 20px;
    position: absolute;
    top: 50%;
    left: 12.9%;
    transform: translateY(-50%);
    span {
      color: #FFFF95;
    }
  }
} 
@keyframes danmu-animation
{
0%   {left:100%;}
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