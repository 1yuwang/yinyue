// app.js
import {
  getLoginCode,
  sendCodeToServer,
  checkToken,
  checkSession
} from "./service/api_login"
import localCache from "./utils/localCache"
App({
  globalData: {
    statusBarHeight: 0,
    screenHeight: 0
  },
  onLaunch: function () {
    // 获取设备信息
    const info = wx.getSystemInfoSync();
    // console.log(info);
    this.globalData.statusBarHeight = info.statusBarHeight;
    this.globalData.screenHeight = info.screenHeight
    // 让用户默认进行登录
    this.hanldeLogin()
    
  },
  hanldeLogin: async function () {

    const token = localCache.getCache("token")
    // token有没有过期
    const checkResult = await checkToken(token)
    // 判断session_key是否过期
    const isSessionExpire = await checkSession()
    console.log(isSessionExpire);
    // 没有token  token过期  session过期
    if (!token || checkResult.errorCode || !isSessionExpire) {
      this.loginAction()
    }
  },
  loginAction: async function () {
    // 1.获取code
    const code = await getLoginCode()

    // 2.将code发送给服务器
    const result = await sendCodeToServer(code)
    const {
      token
    } = result
    localCache.setCache("token", token)
  }
})