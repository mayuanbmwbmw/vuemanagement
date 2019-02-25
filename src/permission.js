import router from './router'
router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) { // 判断是否需要登录权限
    next()
  } else {
    next()
  }

  next()
})

