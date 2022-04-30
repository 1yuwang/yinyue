import {
  loginRequest
} from "./index"

export function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: res => {
        // code
        const code = res.code
        resolve(code)
        // 发送网络请求发送给服务器
      },
      fail: err => {
        console.log(err);
        reject(err)
      }
    })
  })
}

export function sendCodeToServer(code) {
  return loginRequest.post("/login", {
    code
  })
}

export function checkToken(token) {
  return loginRequest.post("/auth", {}, {
    token
  })
}

export function checkSession() {
  return new Promise(resolve => {
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

export function getUserInfo() {
  return new Promise(resolve => {
    wx.getUserProfile({
      desc: 'desc',
      success: res => {
        resolve(res)
      }
    })
  })
}