<template>
  <div class="baseinfo">
    <header-info @edit-nickname="switchComp('UpdateNickname', $event)" />
    <div class="divider" style="display: block;height: 1px;width: 100%;background:#ccc"></div>
    <component :is="dynamicName" v-bind="dynamicData" @goback="switchComp('Encrypt')"></component>
  </div>
</template>

<script>
import HeaderInfo from './components/HeaderInfo'
import Encrypt from './components/Encrypt'

import { apiUserLevel } from '@/api/user'
import { mapGetters } from 'vuex'
export default {
  name: 'BaseInfo',
  components: {
    HeaderInfo, Encrypt,
  },
  props: {
    reduction: Boolean
  },
  data(){
    return {
      dynamicName: 'Encrypt',
      dynamicData: null
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    reduction(val) {
      if(val) {
        this.switchComp('Encrypt')
        this.$emit('selectReduction', false)
      }
    }
  },
  methods: {
    toWan(number) {
      if(number > 10000){
        return Math.floor(number / 10000 * 10) / 10 + '万'
      }
      return number + '万'
    },
    //组件切换
    switchComp(name, data){
      if(this.$options.components[name] === undefined){
        this.$options.components[name] = require(`./components/${name}`).default
      }
      this.dynamicName = name
      this.dynamicData = data
    }
  },
}
</script>

<style lang="scss" scoped>
.baseinfo{
  width: 95%;
  height: 100%;
  background: #ffffff;
  border-radius: 10px;
  margin: 20px auto;
  .el-divider{
    height: 2em;
    margin: 0 40px;
  }
}
</style>