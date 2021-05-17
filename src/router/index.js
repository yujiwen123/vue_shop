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
      import(/* webpackChunkName: "login_home_welcome" */ "views/login/Login.vue"),
  },
  {
    path: '/home',
    redirect: '/welcome',
    component: () =>
      import(/* webpackChunkName: "login_home_welcome" */ "views/home/Home.vue"),
    children: [
      {
        path: '/welcome',
        component: () =>
          import(/* webpackChunkName: "login_home_welcome" */ "views/main/Welcome.vue"),
      },
      {
        path: '/users',
        component: () =>
          import(/* webpackChunkName: "user_rights_roles" */ "components/user/Users.vue"),
      },
      {
        path: '/rights',
        component: () =>
          import(/* webpackChunkName: "user_rights_roles" */ "components/power/rights/Rights.vue"),
      },
      {
        path: '/roles',
        component: () =>
          import(/* webpackChunkName: "user_rights_roles" */ "components/power/roles/Roles.vue"),
      },
      {
        path: '/categories',
        component: () =>
          import(/* webpackChunkName: "categories_params_goods" */ "components/goods/cate/Cate.vue"),
      },
      {
        path: '/params',
        component: () =>
          import(/* webpackChunkName: "categories_params_goods" */ "components/goods/params/Params.vue"),
      },
      {
        path: '/goods',
        component: () =>
          import(/* webpackChunkName: "categories_params_goods" */ "components/goods/list/List.vue"),
      },
      {
        path: '/goods/add',
        component: () =>
          import(/* webpackChunkName: "add_orders_reports" */ "components/goods/add/Add.vue"),
      },
      {
        path: '/orders',
        component: () =>
          import(/* webpackChunkName: "add_orders_reports" */ "components/order/Order.vue"),
      },
      {
        path: '/reports',
        component: () =>
          import(/* webpackChunkName: "add_orders_reports" */ "components/report/Report.vue"),
      },
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
