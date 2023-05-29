<template>
  <el-dialog
    class="assign-role"
    title="分配角色"
    :visible="showRoleDialog"
    :close-on-click-modal="false"
    @close="closeRoleDialog"
    @open="openRoleDialog"
  >
    <!-- 这里准备复选框 -->
    <!-- `checked` 为 true 或 false -->
    <!-- <el-checkbox v-model="checked">备选项</el-checkbox> -->
    <el-checkbox-group v-model="checkList" v-loading="isLoading">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button type="primary" size="small" @click="assignRole">确定</el-button>
      <el-button size="small" @click="closeRoleDialog">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleListApi } from '@/api/setting'
import { getBaseUserInfoApi } from '@/api/user'
import { assignRolesApi } from '@/api/employees'

export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checkList: [],
      roleList: [],
      isLoading: false
    }
  },
  methods: {
    // 弹窗关闭
    closeRoleDialog() {
      this.$emit('update:showRoleDialog', false)
    },
    // 弹窗打开
    openRoleDialog() {
      this.isLoading = true
      Promise.all([this.getRoleList(), this.getBaseUserInfo()]).then(() => {
        this.isLoading = false
      })
    },
    // 获取角色列表
    async getRoleList() {
      const { data } = await getRoleListApi(1, 9999)
      this.roleList = data.rows
    },
    // 获取用户基本信息
    async getBaseUserInfo() {
      const { data } = await getBaseUserInfoApi(this.userId)
      this.checkList = data.roleIds
    },
    // 确定修改
    async assignRole() {
      const data = { id: this.userId, roleIds: this.checkList }
      await assignRolesApi(data)
      this.$message.success('分配成功')
      this.closeRoleDialog()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
