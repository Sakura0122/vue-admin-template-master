<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    // render函数内部没有this
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      // 如果传过来的是el-icon 表示使用element-ui内置的icon图标
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        // 使用项目的svg图标
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      // jsx语法
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
