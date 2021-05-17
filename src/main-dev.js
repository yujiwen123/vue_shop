import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入NProgress包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 跳转路由时，展示进度条 NProgress.start()
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})
// 隐藏进度条 NProgress.done()
router.afterEach(transition => {
  NProgress.done()
})

// 配置请求的根路径
// 封装思路: axios单独一个文件管理, 创建一个api文件夹, 在里面配置各个组件的请求方法, 
// 再将api添加到Vue实例里, 调用方式this.$api.组件名.方法(传参).then()
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'



axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})
Vue.prototype.$http = axios

// 阻止显示生产模式的消息
Vue.config.productionTip = false

// 将富文本编辑器注册为全局组件
Vue.use(VueQuillEditor, /* { default global options } */)


Vue.component('tree-table', TreeTable)

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal * 1000)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')