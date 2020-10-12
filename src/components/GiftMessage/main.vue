<template>
  <transition name="el-notification-fade">
    <div
      :class="['el-notification', customClass, horizontalClass]"
      v-show="visible"
      :style="positionStyle"
      @mouseenter="clearTimer()"
      @mouseleave="startTimer()"
      @click="click"
      role="alert"
    >
      <div class="gift-left">
        <div class="userName">{{userName}}</div>
        <div class="giftName">送出 {{giftName=='荧光棒'?'奶酪':giftName}}</div>
      </div>
      <div class="gift-right">
        <img :src="giftUrl" alt="" width="55px" v-if="giftUrl">
        <div class="num">×{{giftNum}}</div> 
      </div>         
    </div>
  </transition>
</template>

<script type="text/babel">
  let typeMap = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
  };
  export default {
    data() {
      return {
        visible: false,
        title: '',
        message: '',
        duration: 4500,
        type: '',
        showClose: true,
        customClass: '',
        iconClass: '',
        onClose: null,
        onClick: null,
        closed: false,
        verticalOffset: 0,
        timer: null,
        dangerouslyUseHTMLString: false,
        position: 'top-right',
        giftNum: 1
      };
    },
    computed: {
      typeClass() {
        return this.type && typeMap[this.type] ? `el-icon-${ typeMap[this.type] }` : '';
      },
      horizontalClass() {
        return this.position.indexOf('right') > -1 ? 'right' : 'left';
      },
      verticalProperty() {
        return /^top-/.test(this.position) ? 'top' : 'bottom';
      },
      positionStyle() {
        return {
          [this.verticalProperty]: `${ this.verticalOffset }px`
        };
      }
    },
    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.addEventListener('transitionend', this.destroyElement);
        }
      },
      giftNum() {
        this.clearTimer()
        this.startTimer()
      }
    },
    methods: {
      destroyElement() {
        this.$el.removeEventListener('transitionend', this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);    
      },
      click() {
        if (typeof this.onClick === 'function') {
          this.onClick();
        }
      },
      close() {
        this.closed = true;
        if (typeof this.onClose === 'function') {
          this.onClose();
        }
      },
      clearTimer() {
        clearTimeout(this.timer);
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
      keydown(e) {
        if (e.keyCode === 46 || e.keyCode === 8) {
          this.clearTimer(); // detele 取消倒计时
        } else if (e.keyCode === 27) { // esc关闭消息
          if (!this.closed) {
            this.close();
          }
        } else {
          this.startTimer(); // 恢复倒计时
        }
      }
    },
    mounted() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
      document.addEventListener('keydown', this.keydown);
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.keydown);
    }
  };
</script>

<style lang="scss" scoped>
  .el-notification {
    width: 90%;
    position: absolute;
    left: 0;
    padding: 0 0 0 13px;
    overflow: initial;
    background-image: url(../../assets/image/detail/gift_bg.png);
    background-size: 100% 100%;
    background-color: transparent;
    box-shadow: none;
    border: none;
    border-radius: 0;
    background-repeat: no-repeat;
    font-family: PingFang SC Semibold, PingFang SC Semibold-Semibold;
    .userName {
      font-size: 16px;
      font-weight: 600;
      text-align: left;
      color: #fff498;
      line-height: 26px;
    }
    .giftName {
      font-size: 14px;
      font-weight: 600;
      text-align: left;
      color: #ffffff;
      line-height: 26px;
    }
    .gift-right {
      min-height: 55px;
      display: flex;
      position: absolute;
      top: -15px;
      right: 39px;
      align-items: flex-end;
      img {
        background-color: #fff;
        border: 2px solid #42ebc4;
        border-radius: 6px;
      }
      .num {
        font-size: 30px;
        color: #fff;
        padding-left: 7px;
      }
    }
  }
</style>
