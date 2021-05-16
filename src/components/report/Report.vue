<template>
  <div class="">
    <!-- 面包屑导航区 -->
    <el-breadcrumb></el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import ElBreadcrumb from './childComps/ElBreadcrumb'
import _ from 'lodash'

// 1.引入 echarts
import * as echarts from 'echarts'

export default {
  name: '',
  data() {
    return {
      option: {
        title: {
          text: 'ECharts 入门示例',
        },
        tooltip: {},
        legend: {
          data: ['销量'],
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      },
    }
  },
  components: {
    ElBreadcrumb,
  },
  // 此时页面上的元素被渲染完毕
  async mounted() {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败！')
    }

    // 4.指定图表的配置项和数据
    const result = _.merge(res.data, this.options)

    // 5.使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
  methods: {},
}
</script>

<style lang='less' scoped>
</style>
