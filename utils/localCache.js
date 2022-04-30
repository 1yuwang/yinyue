class LocalCache {
  setCache(key, data) {
    data = JSON.stringify(data)
    wx.setStorageSync(key, data)
    console.log('设置成功');
  }

  getCache(key) {
    const value = wx.getStorageSync(key)
    if (value) {
      return JSON.parse(value)
    }
  }

  removeCache(key) {
    wx.removeStorage({
      key,
      success: function () {
        console.log("删除成功");
      }
    })
  }
}

const localCache = new LocalCache();
export default localCache