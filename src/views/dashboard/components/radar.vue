<template>
  <div ref="radar" class="radar">雷达图</div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Radar',
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(this.$refs.radar)
    // 绘制图表
    myChart.setOption({
      title: {
        text: '个人绩效指数'
      },
      legend: {
        right: 0,
        orient: 'vertical',
        data: ['个人水平', '平均水平']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: '个人水平 vs 平均水平',
          type: 'radar',
          data: [
            {
              value: [100, 100, 100, 100, 100, 100],
              name: '个人水平'
            },
            {
              value: [80, 70, 60, 80, 70, 60],
              name: '平均水平'
            }
          ]
        }
      ]
    })
  }
}
</script>

<style lang="scss" scoped>
.radar {
  width: 500px;
  height: 400px;
}
</style>
