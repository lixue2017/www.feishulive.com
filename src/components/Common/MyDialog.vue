<template>
  <el-dialog 
    :title="title" 
    :width="width" 
    :visible.sync="dialogVisible" 
    :close-on-click-modal="false" 
    :append-to-body="appendToBody" 
    :top="appendToBody && '0'"
    @custom-class="customClass" 
    @opened="handleOpened"
    @close="handleClose"
  >
    <slot name="default" />
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: [Number, String],
      default: ''
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      dialogVisible: false
    }
  },
  methods: {
    handleOpened(){
      this.$emit('opened')
    },
    handleClose() {
      this.$emit('close')
    },
    show(){
      this.dialogVisible = true
    },
    hide(){
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>