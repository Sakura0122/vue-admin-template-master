<template>
  <div class="employees-container">
    <div class="app-container">

      <page-tools>
        <template #left>
          <span slot="before">总记录数：{{ total }}条</span>
        </template>
        <template #right>
          <el-button size="small" type="warning" @click="$router.push('/import?type=user')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportExcel">excel导出</el-button>
          <el-button size="small" type="primary" @click="showAddEmployeeDialog">新增员工</el-button>
        </template>
      </page-tools>

      <!-- 放置表格和分页 -->
      <el-card v-loading="isLoading" style="margin-top: 10px;">
        <el-table :data="list">
          <el-table-column align="center" label="序号" type="index" width="100" :index="indexMethod" />
          <el-table-column align="center" label="头像" prop="staffPhoto">
            <template #default="{row}">
              <img @click="showImgDialogFn(row.staffPhoto)" v-imgerror="errorImg" :src="row.staffPhoto"
                   class="avatar_photo" alt=""
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名" prop="username" />
          <el-table-column align="center" label="手机号" prop="mobile" />
          <el-table-column align="center" label="工号" prop="workNumber" />
          <el-table-column align="center" label="聘用形式" prop="formOfEmployment" :formatter="getEmploymentText">
            <!--  <template #default="{row}">-->
            <!--    {{ getEmploymentText(row.formOfEmployment) }}-->
            <!--  </template>-->
          </el-table-column>
          <el-table-column align="center" label="部门" prop="departmentName" />
          <el-table-column align="center" label="入职时间" prop="timeOfEntry">
            <template #default="{row}">
              {{ row.timeOfEntry | getFormatTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="280">
            <template #default="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div style="height: 60px;margin-top: 10px">
          <el-pagination
            :current-page="page"
            :page-size="size"
            :total="total"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
      <add-employee :show-dialog.sync="showDialog" />
      <el-dialog title="二维码图片" :visible="showCodeDialog" :close-on-click-modal="false" @close="hideCodeDialogFn">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { delEmployeeApi, getUserListApi } from '@/api/employees'
import enumObj from '@/constant/employees'
import AddEmployee from '@/views/employees/components/add-employee.vue'
import { getFormatTime } from '@/filters'
import errorImg from '@/assets/common/404.png'
import QrCode from 'qrcode'

export default {
  name: 'Employees',
  components: { AddEmployee },
  // filters: {
  //   getFormatTime(value) {
  //     return dayjs(value).format('YYYY-MM-DD')
  //   }
  // },
  data() {
    return {
      page: 1,
      size: 10,
      list: [],
      total: 0,
      isLoading: false,
      hireType: enumObj.hireType,
      showDialog: false,
      errorImg,
      // 二维码图片
      showCodeDialog: false
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      this.isLoading = true
      const { data } = await getUserListApi(this.page, this.size)
      this.list = data.rows
      this.total = data.total
      this.isLoading = false
    },
    // 切换页码
    handleCurrentChange(value) {
      this.page = value
      this.getUserList()
    },
    // 计算索引
    indexMethod(index) {
      return (this.page - 1) * this.size + index + 1
    },
    // getEmploymentText(num) {
    //   return num === 1 ? '正式' : '非正式'
    // }
    getEmploymentText(row, column, cellValue, index) {
      const obj = this.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除用户
    delEmployee(id) {
      this.$confirm('确认删除吗', '温馨提示').then(async() => {
        await delEmployeeApi(id)
        if (this.list.length === 1 && this.page > 1) this.page--
        this.$message.success('删除成功')
        this.getUserList()
      }).catch(() => {})
    },
    // 新增员工
    showAddEmployeeDialog() {
      this.showDialog = true
    },
    // 导出excel
    async exportExcel() {
      // 获取所有数据
      const {
        data: { rows }
      } = await getUserListApi(1, this.total)
      const headersArr = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const headersRelations = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const data = this.formatExportData(rows, headersArr, headersRelations)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: headersArr,
          data,
          // 文件名
          filename: '员工',
          // 自适应宽度
          autoWidth: true,
          // 后缀名
          bookType: 'xlsx',
          multiHeader,
          merges
        })
      })
    },
    /**
     * 处理数据中的格式为二维数组
     * @param {any[]} rows 所有数据
     * @param {any[]} headersArr 表头
     * @param {{}} headersRelations 对应关系
     */
    formatExportData(rows, headersArr, headersRelations) {
      const result = []
      rows.forEach(item => {
        const arr = []
        headersArr.forEach(key => {
          const englishKey = headersRelations[key]
          let value = item[englishKey]
          if (['timeOfEntry', 'correctionTime'].includes(englishKey)) {
            value = item[englishKey] ? getFormatTime(item[englishKey]) : ''
          }
          if (englishKey === 'formOfEmployment') {
            const obj = this.hireType.find(enumObj => enumObj.id === item[englishKey])
            value = obj ? obj.value : '未知'
          }
          arr.push(value)
        })
        result.push(arr)
      })
      return result
    },
    // 点击图片
    showImgDialogFn(url) {
      if (!url) return this.$message.error('当前用户没有头像')
      this.showCodeDialog = true
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.myCanvas, url)
      })
    },
    hideCodeDialogFn() {
      this.showCodeDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar_photo {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
</style>
