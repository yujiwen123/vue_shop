<template>
  <div class>
    <!-- 面包屑导航区 -->
    <el-breadcrumb></el-breadcrumb>
    <!-- 搜索与添加区 -->
    <!-- 添加用户的对话框 -->
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索与添加区 -->
      <el-dialog @getUsersList="getUsersList" :queryInfo="queryInfo"></el-dialog>
      <!-- 用户列表区 -->
      <el-table :userslist="userslist" @getUsersList="getUsersList"></el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    
  </div>
</template>

<script>
import ElBreadcrumb from './childComps/ElBreadcrumb'
import ElTable from './childComps/ElTable'
import ElDialog from './childComps/ElDialog'

export default {
  name: '',
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userslist: [],
      total: 0,
    }
  },
  components: {
    ElBreadcrumb,
    ElTable,
    ElDialog,
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败！')
      this.userslist = res.data.users
      this.total = res.data.total
    },

    

    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },

    

  },
  created() {
    this.getUsersList()
  }
}
</script>

<style lang='less' scoped>
</style>
