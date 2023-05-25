<template>
  <div class="image-upload">
    <!--
      i标签 显示上传内的+号
      list-type="picture-card" 显示的上传组件的外边框
      action:必传的 作用：图片服务器对应地址 当你不想使用action上传的时候 可以把action配置成#
      file-list：展示上传成功后的图片 [{url:''},{url:''}]
      on-preview：预览图片
      limit：最多限制用户上传多少张
      :on-exceed 上传图片超过limit设置的值时 会执行on-exceed对应的钩子函数
      :on-remove 点击删除时 执行的钩子函数
      :http-request:自定义上传，覆盖默认的上传行为
      :on-change: 文件改变时的钩子 包括添加、上传成功、上传失败都会调用
      :before-upload: 文件上传前的执行钩子 一般用来校验文件。return  true才会让你上传 return false||Promise.reject() 则停止上传
    -->
    <el-upload
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :limit="limit"
      :class="{disabled:isDisabled}"
      :http-request="upload"
      :on-change="handleChange"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" title="图片预览">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <!-- 进度条 -->
    <el-progress v-if="showPercent" :percentage="percent" style="width: 180px;" />
  </div>
</template>

<script>
import cos from '@/utils/cos'

export default {
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      currentFileUid: '', // 用一个变量 记住当前上传的图片id
      percent: 0,
      showPercent: false // 默认不显示进度条
    }
  },
  computed: {
    isDisabled() {
      return this.fileList.length >= this.limit
    },
    isAllUploadSuccess() {
      return this.fileList.every(item => item.status === 'success')
    }
  },
  methods: {
    // 预览时执行的函数
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    /**
     * 删除时执行的函数
     * @param file 删除的图片
     * @param {any[]} fileList 删除后的图片列表
     */
    handleRemove(file, fileList) {
      this.fileList = [...fileList]
      // this.fileList = fileList.filter(item => item.uid !== file.uid)
    },
    // 文件改变
    handleChange(file, fileList) {
      this.fileList = [...fileList]
    },
    // 上传前校验
    beforeUpload(file) {
      // 1.文件类型
      const imgType = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp', 'image/gif']
      if (!imgType.includes(file.type)) {
        this.$message.error('上传图片格式不正确')
        return false
      }
      // 2.文件大小
      // file.size单位是B -> KB  -> MB
      if (file.size / 1024 / 1024 > 2) {
        this.$message.error('图片大小不能超2M')
        return false
      }
      this.currentFileUid = file.uid // 记住当前的uid
      this.showPercent = true
      return true
    },
    upload(params) {
      if (params.file) {
        cos.putObject({
          // 配置
          Bucket: 'chriswangyx-1317120340', // 存储桶名称
          Region: 'ap-chengdu', // 存储桶地域
          Key: params.file.name, // 文件名作为key
          StorageClass: 'STANDARD', // 此类写死
          Body: params.file, // 将本地的文件赋值给腾讯云配置
          // 进度条
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // 需要判断错误与成功
          if (!err && data.statusCode === 200) {
            // 如果没有失败表示成功了
            // 此时认为上传成功了
            // this.currentFileUid
            // 仍然有个小问题， 比如此时我们正在上传，但是调用了保存，保存在上传过程中进行，
            // 此时上传还没有完成  此时可以这样做 ： 给所有上传成功的图片 加一个属性 upload: true
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                //   upload为true表示 该图片已经成功上传到服务器，地址已经是腾讯云的地址了  就不可以执行保存了
                return { url: 'http://' + data.Location, upload: true } // 将本地的地址换成腾讯云地址
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false // 隐藏进度条
              this.percent = 0 // 进度归0
            }, 2000)

            // 将腾讯云地址写入到fileList上 ，保存的时候 就可以从fileList中直接获取图片地址

            // 此时注意，我们应该记住 当前上传的是哪个图片  上传成功之后，将图片的地址赋值回去
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled {
  ::v-deep {
    .el-upload {
      display: none;
    }
  }
}
</style>
