<template>
  <el-container id="right_main">
    <el-aside :width="is_shrink?'120px':'280px'">
      <slot name="aside" ></slot>
    </el-aside>
    <el-main :class="is_shrink?'is_hover':''">
      <slot name="content" :isScrollbottom="isScrollbottom"></slot>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    is_shrink: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isScrollbottom: 0
    }
  },
  computed: {    
    isLive() {
      return this.$route.path.indexOf("/live") != -1
    }
  },
  mounted() {
    let dom = window
    dom.addEventListener('scroll',this.handleScroll,true);
  },
  methods: {
    handleScroll(e){
      //变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = document.documentElement.scrollTop;
      //变量windowHeight是可视区的高度
      var windowHeight = document.documentElement.clientHeight;
      //变量scrollHeight是滚动条的总高度
      var scrollHeight = document.documentElement.scrollHeight;
      //滚动条到底部的条件
      if(scrollTop+windowHeight==scrollHeight){
          //写后台加载数据的函数
          this.isScrollbottom++;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container{
  font-size: 20px;
  font-weight: 400px;
  color: #ccc;
  .el-aside{
    background-color: #2F3035;
    width: 280px;
    position: fixed;
    left: 0;
    top: 70px;
    z-index: 3;
    height: 100%;
    overflow: inherit;
    &.is_hover {
      margin-left: 120px;
    }
  }
  .el-main{
    margin-left: 280px;
    background-color: #f2f5f6;
    padding: 70px 0 0;
    box-sizing: border-box;
    &.is_hover {
      margin-left: 120px;
    }
  }
}
</style>