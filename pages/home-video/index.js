// pages/home-video/index.j
import {
  getTopMv
} from "../../service/api_video"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topMvs: [],
    hasMore: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData(0)
  },

  loadData: async function (offset) {
    if (!this.data.hasMore) return
    // if (offset === 0) {
    wx.showNavigationBarLoading()
    // }
    const res = await getTopMv(offset)
    let newData = this.data.topMvs
    if (offset === 0) {
      newData = res.data
    } else {
      newData = [...this.data.topMvs, ...res.data]
    }
    this.setData({
      topMvs: newData
    })
    this.setData({
      hasMore: res.hasMore
    })
    wx.hideNavigationBarLoading()
    if (offset === 0) {
      wx.stopPullDownRefresh()
    }
  },

  handlerVideoItemClick: function (event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail-video/index?id=' + id,
    })
  },

  onPullDownRefresh: function () {
    this.loadData(0)
  },

  onReachBottom: function () {
    this.loadData(this.data.topMvs.length)
  }





})