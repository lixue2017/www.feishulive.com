<template>
  <div class="danmuItem" ref="danmuItem" :style="itemStyle+' top:'+positionStyle.top">
    <template v-for="(items, indexs) in text">
      <span :key="indexs" class="text" v-if="items.name === 'text'">{{ items.text }}</span>
      <img v-else-if="items.name === 'img'" :src="items.src" width="22px" height="22px" :key="indexs"/>
    </template>
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
      this.itemStyle= "z-index: 0; color: "+this.color+"; transform: translateX(-"+w+"px);transition: transform 10s linear 0s;"
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
  height: 100%;
  z-index: 1002;
}
</style>
<style lang="scss" scoped>
.danmuItem {
  height: 24px;
  line-height: 24px;
  position: absolute;
  white-space: nowrap;
  pointer-events: none;
  animation: danmu-animation 10s linear;
  cursor: auto; 
  font-size: 20px;
  img {
   vertical-align: middle;  
  }
  .text {
    display: inline-block;
    vertical-align: middle;  
    font-weight: 600;
    overflow: hidden;
    text-shadow: #222 1px 0 1px, #222 0 1px 1px, #222 0 -1px 1px, #222 -1px 0 1px;
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