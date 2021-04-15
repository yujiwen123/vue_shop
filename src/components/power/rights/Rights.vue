<template>
  <div class=''>
    <!-- 面包屑导航区 -->
    <el-breadcrumb></el-breadcrumb>
    <el-card>
      <el-table :data="rightList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level === '2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import ElBreadcrumb from './childComps/ElBreadcrumb'

export default {
  name: '',
  data(){
    return {
      rightList: []
    }
  },
  created() {
    // 获取所有的权限
    this.getRightsList()
  },
  components: {
    ElBreadcrumb
  },
  methods: {
    async getRightsList() {
      const {data: res} = await this.$http.get('rights/list')
      if(res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      this.rightList = res.data
      // console.log(this.rightList)
    }
  }
}
</script>

<style lang='less' scoped>
/deep/ th{
  text-align: center;
}
/deep/ td {
  text-align: center;
}
</style>
