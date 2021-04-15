<template>
  <div class>
    <h2>角色列表</h2>
    <!-- 面包屑导航区 -->
    <el-breadcrumb></el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色 -->
      <add-roles @getRolesList="getRolesList"></add-roles>
      <!-- 角色列表区 -->
      <roles-table @getRolesList="getRolesList" :rolesList="roleList"></roles-table>
    </el-card>
  </div>
</template>

<script>
import ElBreadcrumb from './childComps/ElBreadcrumb'
import AddRoles from './childComps/AddRoles'
import RolesTable from './childComps/RolesTable'

export default {
  name: '',
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
    }
  },
  created() {
    this.getRolesList()
  },
  components: {
    ElBreadcrumb,
    AddRoles,
    RolesTable
  },
  methods: {
    // 获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }

      this.roleList = res.data
      // console.log(this.roleList)
    },
  }
}
</script>

<style lang='less' scoped>
/deep/ th {
  text-align: center;
}
/deep/ td {
  text-align: center;
}
/deep/ .el-table__expanded-cell {
  text-align: left;
}
/deep/ .el-table__expanded-cell {
  text-align: left;
}
</style>
