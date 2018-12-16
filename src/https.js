import axios from 'axios'
import { Message, Loading } from 'element-ui';   //从element结构出两message和loading
import router from './router'

let loading //定义loading变量

function startLoading() { //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,  //是否锁定
    text: '加载中...', //显示的内容
    background: 'rgba(0, 0, 0, 0.7)' //背景颜色
  })
}

function endLoading() { //使用Element loading-close 方法
  loading.close()
}

// 请求拦截
axios.interceptors.request.use(config => {
  // 加载动画
  startLoading()
  if (localStorage.eleToken)   //判断本地是否存在token
    // 设置统一的请求头header
    config.headers.Authorization = localStorage.eleToken
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截  401 token过期处理
axios.interceptors.response.use(response => {
  // 结束加载动画
  endLoading()
  return response
}, error => {
  // 错误提醒
  endLoading()
  Message.error(error.response.data)
  // 获取错误状态码，判断status是否是401
  const { status } = error.response
  if (status == 401) {
    Message.error('token值无效，请重新登录')
    // 清除token
    localStorage.removeItem('eleToken')

    // 页面跳转
    router.push('/login')
  }

  return Promise.reject(error)
})

export default axios   //输出 ，然后main.js使用
