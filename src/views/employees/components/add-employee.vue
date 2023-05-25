<template>
  <!--@open="openDialogFn"-->
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    top="10vh"
    :close-on-click-modal="false"
    @close="closeDialog"
    @click.native="hideDeptsList"
  >
    <!-- 表单 -->
    <el-form ref="addForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width:50%"
          :readonly="true"
          placeholder="请选择部门"
          @click.native.stop="getDepartmentList"
        />
        <div v-if="isShowTree" class="tree-box">
          <el-tree
            v-loading="isLoading"
            :data="list"
            :props="{label:'name'}"
            @node-click="handleNodeClick"
          />
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="closeDialog">取消</el-button>
          <el-button type="primary" size="small" @click="addEmployee">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartmentListApi } from '@/api/departments'
import { transListToTreeData } from '@/utils'
import enumObj from '@/constant/employees'
import { addEmployeeApi } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      formData: {
        // 用户名
        username: '',
        // 手机号
        mobile: '',
        // 聘用形式
        formOfEmployment: '',
        // 工号
        workNumber: '',
        // 部门
        departmentName: '',
        // 入职时间
        timeOfEntry: '',
        // 转正时间
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不可为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户名1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      },
      isShowTree: false,
      isLoading: false,
      hireType: enumObj.hireType
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog() {
      this.$emit('update:showDialog', false)
      this.$refs.addForm.resetFields()
    },
    async getDepartmentList() {
      this.isShowTree = !this.isShowTree
      this.isLoading = true
      const { data } = await getDepartmentListApi()
      this.isLoading = false
      this.list = transListToTreeData(data.depts, '')
    },
    hideDeptsList() {
      this.isShowTree = false
    },
    // 点击树中节点
    handleNodeClick(data) {
      if (data.children && data.children.length > 0) return
      this.formData.departmentName = data.name
      this.isShowTree = false
    },
    // 添加员工
    addEmployee() {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        await addEmployeeApi(this.formData)
        this.closeDialog()
        this.$message.success('添加成功')
        this.$parent.getUserList()
      })
    }
    // 打开弹窗
    // openDialogFn() {
    //   this.getDepartmentList()
    // }
  }
}
</script>

<style lang="scss" scoped>
.tree-box {
  position: absolute;
  width: 50%;
  min-height: 50px;
  left: 0;
  top: 45px;
  z-index: 100;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-right: 5px;
  background-color: #fff;
  overflow: auto;
  max-height: 200px;

  ::v-deep {
    .el-tree-node__content {
      height: auto;
    }
  }
}
</style>
