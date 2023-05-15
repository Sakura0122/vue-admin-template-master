<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card v-loading="isLoading">
        <el-tabs v-model="activeName">
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理" name="role">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="showAddRoleDialog">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border :data="list">
              <el-table-column label="序号" align="center" width="120" type="index" :index="indexMethod" />
              <el-table-column label="角色名称" align="center" width="240" prop="name" />
              <el-table-column label="描述" align="center" prop="description" />
              <el-table-column label="操作" align="center">
                <template #default="{row}">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <div style="padding: 10px;display: flex;justify-content: flex-end">
              <!-- 分页组件 -->
              <!--
                current-page：当前页
                page-sizes：设置当前页容量
                page-size：当前页容量
                layout：分页的布局
                total：总条数
                @size-change：切换页容量
                @current-change：切换页码
               -->
              <el-pagination
                :current-page="page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-tab-pane>

          <el-tab-pane label="公司信息" name="company">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="companyForm.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyForm.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyForm.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyForm.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <el-dialog :visible="showDialog" :title="showTitle" :close-on-click-modal="false" @close="closeDialog">
        <el-form ref="roleForm" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="form.description" placeholder="请输入角色描述" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="handleAddRole">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { addRoleApi, delRoleApi, getRoleDetail, getRoleListApi, updateRole } from '@/api/setting'
import { mapState } from 'vuex'
import { getCompanyInfoApi } from '@/api/company'

export default {
  name: 'Setting',
  data() {
    return {
      // 当前页
      page: 1,
      // 当前页容量
      pageSize: 10,
      // 当前页面列表数据
      list: [],
      // 列表条数总和
      total: 0,
      isLoading: false,
      showDialog: false,
      // 角色信息
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      // 选中标签
      activeName: 'role',
      // 公司信息
      companyForm: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      }
    }
  },
  computed: {
    ...mapState('user', ['userinfo']),
    showTitle() {
      return this.form.id ? '编辑角色' : '新增角色'
    }
  },
  watch: {
    activeName(newValue) {
      if (newValue === 'company') {
        this.getCompanyInfo()
      }
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      this.isLoading = true
      const { data: { rows, total }} = await getRoleListApi(this.page, this.pageSize)
      this.list = rows
      this.total = total
      this.isLoading = false
    },
    // 切换页容量
    handleSizeChange(val) {
      this.pageSize = val
      this.page = 1
      this.getRoleList()
    },
    // 切换页码
    handleCurrentChange(val) {
      this.page = val
      this.getRoleList()
    },
    indexMethod(index) {
      return (this.page - 1) * this.pageSize + index + 1
    },
    // 删除角色
    delRole(id) {
      this.$confirm('确认删除吗？', '温馨提示').then(async() => {
        await delRoleApi(id)
        this.$message.success('删除成功')
        // 如果删除的页码不为1 并且只有一条数据 删除之后应该加载前一页数据
        if (this.page > 1 && this.list.length === 1) {
          this.page--
        }
        this.getRoleList()
      }).catch(() => {})
    },
    // 新增角色
    showAddRoleDialog() {
      this.showDialog = true
    },
    // 关闭弹窗
    closeDialog() {
      this.showDialog = false
      this.$refs.roleForm.resetFields()
      this.form = {
        name: '',
        description: ''
      }
    },
    // 新增/编辑角色
    handleAddRole() {
      this.$refs.roleForm.validate(async flag => {
        if (!flag) return
        this.form.id ? await updateRole(this.form) : await addRoleApi(this.form)
        this.form.id ? this.$message.success('编辑角色成功') : this.$message.success('新增角色成功')
        this.closeDialog()
        this.getRoleList()
      })
    },
    // 编辑角色
    async editRole(id) {
      const { data } = await getRoleDetail(id)
      this.form = data
      this.showDialog = true
    },
    async getCompanyInfo() {
      const { data } = await getCompanyInfoApi(this.userinfo.companyId)
      this.companyForm = data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
