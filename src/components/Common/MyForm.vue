<template>
  <el-form ref="myForm" :model="formModel" :rules="formRules" :labelWidth="formConfig.labelWidth || '100px'" :label-position="formConfig.labelPosition" @validate="handleValidate">
    <template v-for="(rowList, index) in formConfig.fieldList">
      <el-row v-for="(colList, rowIndex) in rowList.rows" :gutter="20" :key="`${index}_${rowIndex}_row`">
        <el-col v-for="(fieldItem, colIndex) in colList.cols" :key="`${rowIndex}_row${colIndex}_col`" :span="fieldItem.span ? fieldItem.span : 24/colList.cols.length">
          <el-form-item v-if="visibleAll[fieldItem.id]" :label="fieldItem.label" :prop="fieldItem.id" :label-width="fieldItem.labelWidth">
            <el-input v-if="fieldItem.type=='text'" v-model="formModel[fieldItem.id]" :placeholder="fieldItem.placeholder" :disabled="disableAll[fieldItem.id]" :maxlength="fieldItem.maxlength"/>
            <el-input v-if="fieldItem.type=='password'" type="password" v-model="formModel[fieldItem.id]" autocomplete="new-password" :maxlength="fieldItem.maxlength"></el-input>
            <el-radio-group v-if="fieldItem.type=='radio'" v-model="formModel[fieldItem.id]">
              <el-radio v-for="selectItem in selectAll[fieldItem.id]" :key="selectItem.value" :label="selectItem.label">{{ selectItem.value }}</el-radio>
            </el-radio-group>
            <el-select v-if="fieldItem.type=='select'" v-model="formModel[fieldItem.id]" @change="bindThis(fieldItem.handle)" style="width:100%">
              <el-option v-for="selectItem in selectAll[fieldItem.id]" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"/>
            </el-select>
            <el-input
              v-if="fieldItem.type=='textarea'"
              type="textarea"
              v-model="formModel[fieldItem.id]"
              :placeholder="fieldItem.placeholder"
              :maxlength="fieldItem.maxlength"
              :rows="fieldItem.rows||2"
              :disabled="disableAll[fieldItem.id]"
              show-word-limit
            />
            <template v-if="fieldItem.type=='slot'" >
              <slot :name="fieldItem.id" :formModel="formModel" :disableAll="disableAll" :selectAll="selectAll" />
            </template>
            <template v-if="fieldItem.tip" >
              <slot :name="fieldItem.tip" :formModel="formModel" :selectAll="selectAll" />
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <el-form-item>
      <slot name="form-submit" />
    </el-form-item>
  </el-form>
</template>

<script>
import Schema from 'async-validator'
export default {
  props: {
    formConfig: {
      type: Object,
      default: ()=>{}
    }
  },
  data(){
    return {
      validator: null,
      formModel: {},
      formRules: {},
      selectAll: {},
      disableAll: {},
      visibleAll: {}
    }
  },
  watch: {
    formModel: {
      deep: true,
      handler: function(newVal, oldVal){
        //实时验证表单
        this.validator.validate(newVal, { firstFields: true }, (errors, invalidFields) => {
          if(errors === null){
            this.$emit('input-validate', true)
          }else{
            this.$emit('input-validate', false)
          }
        })
      }
    }
  },
  created () {
    this.formModel = this.getFormModel()
    this.formRules = this.getFormRules()
    this.validator = new Schema(this.formRules)
  },
  mounted () {
    if(typeof this.formConfig.afterMounted == 'function'){
      this.formConfig.afterMounted.call(this)
    }
  },
  methods: {
    bindThis(handle){
      return handle && handle.call(this)
    },
    /**
     * private
     * 获取表单Model
     */
    getFormModel() {
      let _formModel = {}
      this.formConfig.fieldList.map((rowList)=>{
        rowList.rows.map((colsList)=>{
          colsList.cols.map((fieldItem)=>{
            fieldItem.type = fieldItem.type || 'text'
            this.$set(this.disableAll, fieldItem.id, fieldItem.disable || false)
            this.$set(this.visibleAll, fieldItem.id, fieldItem.visible === undefined ? true :  fieldItem.visible)
            if(fieldItem.options){
              this.selectAll[fieldItem.id] = fieldItem.options
            }
            _formModel[fieldItem.id] = fieldItem.value !== undefined ? fieldItem.value : ''
          })
        })
      })
      if(this.formConfig.formModel){
        _formModel = Object.assign(_formModel, this.formConfig.formModel)
      }
      return _formModel
    },
    /**
     * private
     * 获取表单Rules
     */
    getFormRules(){
      for(let key in this.formConfig.formRules){
        this.formConfig.formRules[key].map((rule)=>{
          if(typeof rule.validator === 'function'){
            rule.validator.bind(this)
          }
        })
      }
      return this.formConfig.formRules
    },
    /**
     * public
     * 提交表单数据
     */
    submitForm(){
      this.$refs['myForm'].validate((valid) => {
        if (valid) {
          if(typeof this.formConfig.confirm === 'function'){
            this.formConfig.confirm.call(this).then(()=>{
              this.sendHttp()
            })
          }else{
            this.sendHttp()
          }
        }
      })
    },
    /**
     * private
     * 发送http
     */
    sendHttp(){
      this.$emit('before-request')
      this.formConfig.httpRequest(this.getFormParams()).then((result)=>{
        this.$emit('success-request')
        this.$message.success(this.formConfig.successMessage || '操作成功')
        this.formConfig.successFunction && this.formConfig.successFunction.call(this)
      }).finally(()=>{
        this.$emit('complete-request')
      })
    },
    /**
     * public
     * 获取表单提交参数
     */
    getFormParams(){
      if(typeof this.formConfig.getFormParams === 'function'){
        return this.formConfig.getFormParams(Object.assign({}, this.formModel))
      }
      return this.formModel
    },
    /**
     * public
     * 设置form model
     */
    setFormModel(formData, deep = false){
      if(deep){
        this.formModel = Object.assign({}, formData)
      }else{
        let _formModel = {}
        Object.keys(this.formModel).map((key)=>{
          if(formData[key] !== undefined){
            _formModel[key] = formData[key]
          }else{
            _formModel[key] = this.formModel[key]
          }
        })
        this.formModel = _formModel
      }
    },
    /**
     * public
     * 表单重置
     */
    resetForm(){
      this.$refs.myForm.resetFields()
    },
    /**
     * 表单验证时触发
     */
    handleValidate(name, state){
      this.$emit('validate', {name, state})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>