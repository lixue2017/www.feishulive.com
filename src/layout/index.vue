<template>
  <el-container :class="{ container_live: isLive}">
    <el-header :class="{ noHome: isNoHome,  live: isLive}"><HeaderContent/></el-header>
    <router-view />
  </el-container>
</template>

<script>
import HeaderContent from './Header'
export default {
  components: {
    HeaderContent,
  },
  computed: {
    isNoHome() {
      return this.$route.path !== '/index'
    },
    isLive() {
      return this.$route.path.indexOf("/live") != -1 || this.$route.path.indexOf("/my") !=-1
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container{
  width: 100%;
  min-height: 100%;
  font-size: 20px;
  color: #ccc;
}
.el-container.container_live {
  min-width: 1460px;
}
.el-header{
  height: 70px !important;
  position: relative;
}
.el-header.noHome{
  background-color: #165B79;
}
.el-header.live{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
}
// @media screen and (max-width: 1500px) {
//   .el-container {
//     min-width: 1160px;
//   }
// }
</style>