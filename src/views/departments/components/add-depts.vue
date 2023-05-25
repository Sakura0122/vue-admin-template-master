<template>
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    :close-on-click-modal="false"
    @close="closeDialog"
    @open="openDialog"
  >
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <!-- el-form：form表单 类似于html中form -->
    <!-- el-form-item: 表单域 表示表单中每一行 label:表单域的标题 -->
    <!-- el-input  el-select 表单元素 -->
    <!-- label-width：表单域标题的宽度 -->

    <!-- 校验的四要素 -->
    <!-- el-form  :model  :rules -->
    <!-- el-form-item prop -->
    <!-- el-input v-model -->
    <el-form ref="addForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择">
          <el-option v-for="item in employeeList" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="submitDepts">确定</el-button>
        <el-button size="small" @click="closeDialog">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getSimpleUserListApi } from '@/api/employees'
import { addDepartmentApi, editDepartmentApi, getDepartmentDetailApi } from '@/api/departments'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: () => {
      }
    },
    departsList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {
        // 部门名称
        name: '',
        // 部门编码
        code: '',
        // 部门管理者
        manager: '',
        // 部门介绍
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不可为空', trigger: 'blur' },
          { mix: 1, max: 10, message: '部门名称字符长度为1~10', trigger: 'blur' },
          { validator: this.validateDeptNameIsRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不可为空', trigger: 'blur' },
          { mix: 1, max: 10, message: '部门名称字符长度为1~10', trigger: 'blur' },
          { validator: this.validateDeptCodeIsRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请选择部门负责人', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不可为空', trigger: 'blur' },
          { mix: 1, max: 300, message: '部门介绍字符长度为1~300', trigger: 'blur' }
        ]
      },
      // 员工列表
      employeeList: [],
      // 表单名称
      showTitle: ''
    }
  },
  methods: {
    closeDialog() {
      // this.$emit('closeDialogFn')
      // 子组件通过固定方法修改父组件的值
      this.$emit('update:showDialog', false)
      this.$refs.addForm.resetFields()
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
    },
    validateDeptNameIsRepeat(rule, value, callback) {
      let children = []

      const isSameNode = this.formData.id && this.treeNode.name === value
      const parentId = this.formData.id ? this.treeNode.pid : this.treeNode.id

      if (isSameNode) return callback()

      children = this.departsList.filter(item => item.pid === parentId)
      const isRepeat = children.some(item => item.name === value)
      isRepeat ? callback(new Error('当前部门已存在')) : callback()
      // if (this.formData.id) {
      //   // 判断输入内容是否和原来一样
      //   if (this.treeNode.name === value) {
      //     return callback()
      //   }
      //   // 输入内容和其他兄弟节点进行对比
      //   children = this.departsList.filter(item => item.pid === this.treeNode.pid) || []
      // } else {
      //   // 判断当前目标的子部门 是否和输入内容一样
      //   // 当前部门信息存在treeNode中
      //   // 所有部门信息在departsList中
      //   children = this.departsList.filter(item => item.pid === this.treeNode.id)
      // }
      // const isRepeat = children.some(item => item.name === value)
      // isRepeat ? callback(new Error('当前部门已存在')) : callback()
    },
    validateDeptCodeIsRepeat(rule, value, callback) {
      // 编辑的时候如果输入部门code和我自己的一样 那么校验通过
      if (this.formData.id && this.treeNode.code === value) {
        return callback()
      }
      const isRepeat = this.departsList.some(item => item.code === value)
      isRepeat ? callback(new Error('当前编码已存在')) : callback()
    },
    // 获取员工列表
    async getSimpleUserList() {
      const { data } = await getSimpleUserListApi()
      this.employeeList = data
    },
    // 提交表单
    submitDepts() {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        if (this.formData.id) {
          await editDepartmentApi(this.formData)
          this.$message.success('编辑成功')
        } else {
          await addDepartmentApi({ ...this.formData, pid: this.treeNode.id })
          this.$message.success('添加成功')
        }
        // 关闭弹窗
        this.closeDialog()
        // 刷新列表
        this.$emit('add-dept-success')
      })
    },
    // 打开弹窗
    openDialog() {
      this.getSimpleUserList()
    },
    // 获取部门详情
    async getDepartmentDetail() {
      const { data } = await getDepartmentDetailApi(this.treeNode.id)
      this.formData = data
    }
  }
}
</script>

<style scoped lang="less">

</style>
