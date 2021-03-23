<template>
  <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  name: '',
  data(){
    return {}
  },
  components: {},
  methods: {}
}
</script>

<style lang='less' scoped>
</style>
