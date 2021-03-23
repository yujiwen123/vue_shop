<template>
  <el-container class="home-container" direction="vertical">
    <!-- 头部区 -->
    <home-header></home-header>
    <!-- 主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <home-aside></home-aside>
      <!-- 右侧内容主体 -->
      <home-main></home-main>
    </el-container>
  </el-container>
</template>

<script>
import HomeHeader from './childComps/HomeHeader'
import HomeAside from './childComps/HomeAside'
import HomeMain from './childComps/HomeMain'

export default {
  name: 'Home',
  data() {
    return {
      
    }
  },
  components: {
    HomeHeader,
    HomeAside,
    HomeMain,
  },
  methods: {
    
  },
  created() {
    
  }
}
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}
</style>
