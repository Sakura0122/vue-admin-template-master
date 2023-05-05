export const imgerror = {
  // 当使用这个自定义指令的标签被渲染时就会执行inserted钩子
  // el：表示使用这个指令的标签
  // binding：使用指令传过来的标签
  inserted(el, binding) {
    // img标签有一个onerror错误事件 当图片加载失败会执行这个事件
    el.onerror = function() {
      el.src = binding.value
    }
  }
}

export const color = {
  inserted(el, binding) {
    el.style.color = binding.value
  }
}
