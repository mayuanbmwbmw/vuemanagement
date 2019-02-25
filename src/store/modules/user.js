import { login, logout, getInfo } from '@/api/login'
import { getSession, setSession, removeSession } from '@/utils/storage'

const TokenKey = 'Zhibo-Admin-Token'
const UserInfo = 'Zhibo-Admin-UserInfo'
const UserId = 'Zhibo-Admin-UserId'

const user = {
  state: {
    token: getSession(TokenKey),
    userId: getSession(UserId),
    userInfo: JSON.parse(getSession(UserInfo))

    /*
    userInfo的结构：
    "createTime",
    "departmentId",
    "departmentName",
    "enterpriseId",
    "enterpriseName",
    "userEmail",
    "userId",
    "userName",
    "userPassword",
    "userPhone",
    "userRole",
    "userType"
    */
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },

  actions: {
    // 登录
    Login({ commit }, loginInfo) {
      const username = loginInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, loginInfo.password).then(response => {
          setSession(TokenKey, response.value.token)
          commit('SET_TOKEN', response.value.token)
          setSession(UserId, response.value.userId)
          commit('SET_USERID', response.value.userId)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.userId).then(response => {
          commit('SET_USERINFO', response.value)
          setSession(UserInfo, response.value)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_USERINFO', {})
          commit('SET_USERID', '')

          removeSession(TokenKey)
          removeSession(UserInfo)
          removeSession(UserId)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
