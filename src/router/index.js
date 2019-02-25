import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/public/index/index'),
    name: '前台首页',
    meta: { requireAuth: false }
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/layout/Layout'),
    redirect: '/admin/room',
    name: 'Dashboard',
    children: [
      {
        path: '/admin/room',
        name: '直播间管理',
        component: () => import('@/views/admin/room/index'),
        meta: { requireAuth: true }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    name: '404错误页',
    meta: { requireAuth: false }
  },
  { path: '*', redirect: '/404' }
]

const router = new Router({
  mode: 'history', // 后端支持可开
  base: '/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export default router

