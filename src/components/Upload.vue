<template>
  <div class="upload">
    <template v-if="type=='1'">
      <el-upload
        :action="action"
        list-type="picture-card"
        :show-file-list="true"
        :on-preview="handlePictureCardPreview"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl">
      </el-dialog>
    </template>
    <template v-else>
      <div class="single">
        <el-upload
          class="avatar-uploader"
          :action="action"
          :headers="headers"
          :data="extData"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :disabled="disabled">
          <span v-if="dialogImageUrl" class="tip">
            <i class="el-icon-plus avatar-uploader-icon" :style="uploaderIconStyle"></i>
          </span>
          <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar" :style="uploaderIconStyle">
          <i v-else class="el-icon-plus avatar-uploader-icon" :style="uploaderIconStyle"></i>
          <div v-if="disabled" class="mask"></div>
        </el-upload>
      </div>      
    </template>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: '1'
    },
    value: String,
    uploadStyle: {
      type: Object,
      default: ()=>{}
    },
    shape: {
      type: String,
      default: 'square'
    },
    url: {
      type: String,
      default: 'base/uploadImage'
    },
    extData: {
      type: Object,
      default: ()=>{}
    }
  },
  created () {
    if(this.type == "3"){
      this.headers.token = this.$store.getters.token
    }
    this.action = process.env.VUE_APP_BASE_API + this.url
    //初始化lineHeight
    if(this.uploadStyle) {
      this.uploaderIconStyle = Object.assign(this.uploadStyle, {lineHeight: this.uploadStyle.height})
    }    
  },
  mounted () {
    if(this.shape === 'circle'){
      this.$el.querySelector('.el-upload.el-upload--text').style.borderRadius = '50%'
    }
  },
  data(){
    return {
      uploaderIconStyle: {
        width: '148px',
        height: '148px'
      },
      action: '',
      headers: {},
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  watch:{
    value(newValue, oldValue){
      // this.dialogImageUrl = this.value
      if(!newValue) return
      if(this.isURL(newValue)){
        this.dialogImageUrl = newValue
      }else{
        this.dialogImageUrl = window.atob(newValue)
      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      if(res.code === '200'){
        let imgUrl = res.data.imageUrl || res.data
        if(this.type !== '1'){
          if(this.isURL(imgUrl)){
            this.dialogImageUrl = imgUrl
          }else{
            this.dialogImageUrl = window.atob(imgUrl)
          }
        }
        this.$emit('upload-success', imgUrl)
        this.$emit('input', imgUrl)
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG, PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isJPG && isLt2M;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    isURL(url){
      return /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i.test(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader{
  /deep/.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/.el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
  /deep/ .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1;
    border-radius: 6px;
    cursor: no-drop;
  }
}
.single {
  position: relative;
  .tip{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
    &::after{
      display: inline-block;
      content: "";
      height: 100%;
      vertical-align: middle;
    }
    &:hover{
      opacity: 1
    }
    .avatar-uploader-icon{
      font-size: xxx-large;
      color: #f5f7fa;
      text-align: center;
    }
  }
}
</style>