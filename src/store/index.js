import { createStore } from 'vuex'

export default createStore({
  state: {
    // 获取用户列表的参数对象
    queryInfo: {
      query: '',
      pagenum: 1,
      pagesize: 2
    },
    userslist: [],
    // 控制添加用户对话框的显示与隐藏
    addDialogVisible: false
  },
  mutations: {
    getUsersList(res) {
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败！')
      this.userslist = res.data.users
      this.total = res.data.total
    },
  },
  actions: {
    async agetUsersList(context, payload) {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      context.commit('getUsersList', res)
    },
  },
  modules: {
  }
})
