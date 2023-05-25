<template>
  <upload-excel :on-success="handleSuccess" />
</template>

<script>
import { batchAddEmployeeApi } from '@/api/employees'

export default {
  computed: {
    type() {
      return this.$route.query.type
    }
  },
  methods: {
    async handleSuccess({ results, header }) {
      // 如果是导入员工
      if (this.type === 'user') {
        this.batchAddEmployee(results)
      }
      // if(this.type === 'salary'){
      //   // 调用salary方法
      // }
    },
    // 上传员工
    async batchAddEmployee(results) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        for (const key in item) {
          const englishKey = userRelations[key]
          if (['timeOfEntry', 'correctionTime'].includes(englishKey)) {
            userInfo[englishKey] = this.formatExcelDate(item[key], '-')
          } else {
            userInfo[englishKey] = item[key]
          }
        }
        arr.push(userInfo)
      })
      await batchAddEmployeeApi(arr)
      this.$router.back()
    },
    // 处理日期函数
    formatExcelDate(numb, format) {
      const time = new Date((numb) * 24 * 3600000 + 1) // 毫秒
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''

      if (format && format.length === 1) {
        return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
