<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card class="tree-card" v-loading="loading">
        <!-- 用了一个行列布局 -->
        <tree-tools :tree-node="company" :is-root="true" @add-depts="showAddDeptsDialog" />
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <template #default="{data}">
            <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
            <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
            <tree-tools
              :tree-node="data"
              @del-depts="getDepartmentList"
              @add-depts="showAddDeptsDialog"
              @edit-depts="showEditDeptsDialog"
            />
          </template>
        </el-tree>
      </el-card>
      <add-depts
        ref="addDepts"
        :show-dialog.sync="showDialog"
        :tree-node="treeNode"
        :departs-list="departsList"
        @add-dept-success="getDepartmentList"
      />
    </div>
  </div>
</template>

<script>
import TreeTools from '@/views/departments/components/tree-tools.vue'
import { getDepartmentListApi } from '@/api/departments'
import { transListToTreeData } from '@/utils'
import AddDepts from '@/views/departments/components/add-depts.vue'

export default {
  name: 'Departments',
  components: { AddDepts, TreeTools },
  data() {
    return {
      company: { name: '后台管理系统', manager: '负责人', id: '' },
      // 树结构
      departs: [],
      // 完整数据
      departsList: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      // 面板
      showDialog: false,
      treeNode: {},
      isLoading: false
    }
  },
  created() {
    this.getDepartmentList()
  },
  methods: {
    async getDepartmentList() {
      this.isLoading = true
      const { data } = await getDepartmentListApi()
      this.departsList = data.depts
      this.departs = transListToTreeData(data.depts, '')
      this.isLoading = false
    },
    // 关闭弹窗
    closeDialog() {
      this.showDialog = false
    },
    // 新增数据
    showAddDeptsDialog(treeNode) {
      this.showDialog = true
      this.treeNode = treeNode
      this.$refs.addDepts.showTitle = '新增部门'
      // this.$refs.addDepts.getSimpleUserList()
    },
    // 编辑数据
    showEditDeptsDialog(treeNode) {
      this.showDialog = true
      this.treeNode = treeNode
      this.$refs.addDepts.showTitle = '编辑部门'
      this.$nextTick(() => {
        this.$refs.addDepts.getDepartmentDetail()
      })
    }
    // transListToTreeData(list, searchVal) {
    //   // 思路：先找父级 然后根据父级的id去列表中的所有数据找到与之对应的pid
    //   const arr = []
    //   // 找到所有父级
    //   list.forEach(item => {
    //     if (item.pid === searchVal) {
    //       arr.push(item)
    //     }
    //   })
    //   // 根据父级id和列表所有数据的pid进行对比
    //   arr.forEach(item => {
    //     item.children = list.filter(obj => obj.pid === item.id) || []
    //   })
    //   return arr
    // }
  }
}
</script>

<style lang="scss" scoped>
.el-tree {
  ::v-deep {
    // 小三角的样式, 去掉默认的小三角的旋转效果
    .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    // 有子节点 且未展开 +
    .el-icon-caret-right:before {
      background: url("~@/assets/common/add-circle.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }

    // 有子节点 且已展开 -
    .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
      background: url("~@/assets/common/minus-circle.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }

    // 没有子节点
    .el-tree-node__expand-icon.is-leaf::before {
      background: url("~@/assets/common/user-filling.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
  }
}
</style>
