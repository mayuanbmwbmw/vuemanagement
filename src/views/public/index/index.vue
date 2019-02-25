<template>
  <div class="public">
    <div class="nav">
      <div class="index-top clear">
        <div class="logo fl"></div>
        <div class="guide fr">
          <el-button type="primary" @click="loginNow" v-if="!logined">登录</el-button>
          <el-dropdown @command='handleCommand' class="logined" v-else>
            <div class='el-dropdown-link'>
              <img class="useravatar" :src="useravatarDefault" alt="">
              <div class="username"><span>{{userInfo.userName}}</span> <i class='el-icon-arrow-down el-icon--right'></i></div>
            </div>
            <el-dropdown-menu slot='dropdown'>
              <el-dropdown-item command='admin'><i class='iconfont icon-shezhi'></i> 管理平台中心</el-dropdown-item>
              <el-dropdown-item command='logOut'><i class='iconfont icon-tuichu'></i> 安全退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <transition
      mode="out-in"
      enter-active-class="animated fast fadeInUp"
      leave-active-class="animated fast fadeOutDown">
      <!-- 注册弹窗开始 -->
      <Regist
        v-if="registerShow"
        @close="registerClose"
        @loginNow="loginNow"
      ></Regist>
      <!-- 注册弹窗结束 -->
      <!-- 登录弹窗开始 -->   
      <Login
        v-if="loginShow"
        @close="loginClose"
        @registerNow="registerNow"
        @loginMsg="loginMsg"
      ></login>
      <!-- 登录弹窗结束 -->
    </transition>
    <!-- 内容滚动区域开始 -->
    <el-scrollbar class="page-component__scroll">
      <div class="content">
        <p>DEMO</p>
        <p>内容滚动区域</p>
        <p v-for="n in 10" :key="n">{{n}}</p>
      </div>
    </el-scrollbar>
    <!-- 内容滚动区域结束 -->
  </div>
</template>
<script>
import Login from './login'
import Regist from './regist'
export default {
  name: 'public',
  data() {
    return {
      logined: false,
      userInfo: {},
      loginShow: false,
      registerShow: false,
      useravatarDefault: require('../../../assets/images/admin/avater.png')
    }
  },
  components: {
    Regist,
    Login
  },
  mounted() {
    this.$nextTick(function() {
      if (this.$store.getters.token) {
        if (this.$store.getters.userInfo) {
          this.userInfo = this.$store.getters.userInfo
        }
        this.logined = true
      } else {
        // 如果存在login参数则跳出登陆框
        if (this.$route.query.login) {
          this.loginShow = true
        }
        if (this.$route.query.regist) {
          this.registerShow = true
        }
      }
    })
  },
  methods: {
    registerNow() {
      this.loginShow = false
      this.registerShow = true
    },
    loginNow(evtValue) {
      this.loginShow = true
      this.registerShow = false
    },
    registerClose(evtValue) {
      if (evtValue) { this.registerShow = false }
    },
    loginClose(evtValue) {
      if (evtValue) { this.loginShow = false }
    },
    loginMsg(evtValue) { // 接收登录子组件的登陆用户信息
      this.$router.push('/admin/room')
    },
    logOut() { // 退出登陆
      this.$store.dispatch('LogOut').then((res) => {
        this.logined = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleCommand(command) {
      switch (command) {
        case 'logOut':
          this.logOut()
          break
        case 'admin':
          this.$router.push({ path: '/admin/room' })
          break
        case 'roomIndex':
          this.$router.push({ path: '/roomIndex' })
          break
      }
    }
  }
}
</script>
<style>
@import '../../../assets/styles/public/index.css';
</style>
