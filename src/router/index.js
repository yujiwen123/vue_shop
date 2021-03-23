import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () =>
      import(/* webpackChunkName: "login" */ "views/login/Login.vue"),
  },
  {
    path: '/home',
    redirect: '/welcome',
    component: () =>
      import(/* webpackChunkName: "home" */ "views/home/Home.vue"),
    children: [
      {
        path: '/welcome',
        component: () =>
          import(/* webpackChunkName: "welcome" */ "views/main/Welcome.vue"),
      },
      {
        path: '/users',
        component: () =>
          import(/* webpackChunkName: "welcome" */ "components/user/Users.vue"),
      }
    ]
  }
]

const router = new VueRouter({
  routes

})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next()  放行
  // next('/login')  强制跳转
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})


export default router
