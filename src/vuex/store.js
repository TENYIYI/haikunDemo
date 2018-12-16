import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const types = {
  SET_IS_AUTNENTIATED: 'SET_IS_AUTNENTIATED', // 是否认证通过
  SET_USER: 'SET_USER' // 用户信息
}
export default new Vuex.Store({

  // 驱动应用的数据源 -仓库
  state: {
    token: "",
    isAutnenticated: false,  // 是否认证
    user: {}   // 存储用户信息
  },
  // 获取状态信息
  getters: {
    isAutnenticated: state => state.isAutnenticated,
    user: state => state.user
  },
  // 直接操作state数据的方法
  mutations: {
    [types.SET_IS_AUTNENTIATED](state, isAutnenticated) {
      if (isAutnenticated)
        state.isAutnenticated = isAutnenticated
      else
        state.isAutnenticated = false
    },
    [types.SET_USER](state, user) {
      if (user)
        state.user = user
      else
        state.user = {}
    }
  },
  //什么时候去使用commit调用mutations改变数据， 响应在 view 上的用户输入导致的状态变化。
  actions: {
    setIsAutnenticated: ({ commit }, isAutnenticated) => {
      commit(types.SET_IS_AUTNENTIATED, isAutnenticated)
    },
    setUser: ({ commit }, user) => {
      commit(types.SET_USER, user)
    },
    clearCurrentState: ({ commit }) => {
      commit(types.SET_IS_AUTNENTIATED, false)
      commit(types.SET_USER, null)
    }
  }
})
