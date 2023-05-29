<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="showAddRoleDialog(1,'0')">添加权限</el-button>
        </div>
        <!-- row-key="id" -->
        <!-- row-key表示的是 数据中的唯一表示 类型是字符串 -->
        <el-table border :data="permissionList" row-key="id" default-expand-all>
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{row}">
              <el-button v-if="row.type===1" size="small" type="text" @click="showAddRoleDialog(2,row.id)">添加权限点
              </el-button>
              <el-button size="small" type="text" @click="editRole(row.id)">修改</el-button>
              <el-button size="small" type="text" @click="delRole(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 新增编辑的弹层 -->
      <el-dialog :visible="showDialog" :title="showTitle" :close-on-click-modal="false" @close="closeDialog">
        <!-- 表单内容 -->
        <el-form v-loading="isLoading" label-width="100px">
          <el-form-item label="权限名称">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="权限标识">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" />
          </el-form-item>
          <el-form-item label="权限启用">
            <el-switch
              v-model="formData.enVisible"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <div style="text-align: right;">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="addPermission">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  addPermissionApi,
  delPermissionApi,
  getPermissionDetailApi,
  getPermissionListApi,
  updatePermissionApi
} from '@/api/permission'
import { transListToTreeData } from '@/utils'

export default {
  name: 'Permission',
  data() {
    return {
      permissionList: [],
      showDialog: false,
      formData: {
        enVisible: '0', // 启用禁用, 0禁用, 1启用
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: '' // 添加到哪个节点下
      },
      showTitle: '',
      isLoading: false
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 获取权限列表
    async getPermissionList() {
      const { data } = await getPermissionListApi()
      this.permissionList = transListToTreeData(data, '0')
    },
    // 添加权限
    showAddRoleDialog(type, pid) {
      this.showTitle = '添加权限'
      this.showDialog = true
      this.formData.type = type
      this.formData.pid = pid
    },
    // 确认编辑权限
    async addPermission() {
      this.formData.id ? await updatePermissionApi(this.formData) : await addPermissionApi(this.formData)
      const message = this.formData.id ? '编辑成功' : '添加成功'
      this.$message.success(message)
      this.getPermissionList()
      this.closeDialog()
    },
    // 编辑权限
    async editRole(id) {
      this.showTitle = '编辑权限'
      this.showDialog = true
      this.isLoading = true
      const { data } = await getPermissionDetailApi(id)
      this.isLoading = false
      this.formData = data
    },
    // 删除权限
    delRole(id) {
      this.$confirm('确定删除吗？', '温馨提示').then(async() => {
        await delPermissionApi(id)
        this.$message.success('删除成功')
        this.getPermissionList()
      }).catch(() => {})
    },
    // 关闭弹窗
    closeDialog() {
      this.showDialog = false
      this.formData = {
        enVisible: '0', // 启用禁用, 0禁用, 1启用
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: '' // 添加到哪个节点下
      }
    }
  }
}
</script>
