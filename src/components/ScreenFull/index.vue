<template>
  <div>
    <svg-icon :icon-class="isFullScreen?'exit-fullscreen':'fullscreen'" class="svg-icon" @click="handleScreen" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'

export default {
  data() {
    return {
      isFullScreen: false
    }
  },
  methods: {
    handleScreen() {
      // ScreenFull.isEnabled 判断当前浏览器是否支持大屏切换
      if (ScreenFull.isEnabled) {
        // toggle 可以自动切换大屏 小屏的效果
        this.isFullScreen = !this.isFullScreen
        ScreenFull.toggle()
      } else {
        this.$message.error('您的浏览器版本过期，暂不支持大屏切换')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 20px;
  height: 20px;
  fill: #fff;
  cursor: pointer;
}
</style>
