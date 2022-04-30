// pages/song-menu-list/index.js
import {
  getSongMenu
} from "../../service/api_music"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    songMenuList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const cat = options.cat
    this.setData({
      title: cat
    })
    this.loadData(cat)
  },

  loadData: function (cat, limit = 10, offset) {
    getSongMenu(cat, limit, offset).then(res => {
      this.setData({
        songMenuList: [...this.data.songMenuList, ...res.playlists]
      })
    })
  },

  handleMenuItemClick: function (event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail-song/index?id=${id}&type=menu`,
    })
  },

  onReachBottom: function () {
    this.loadData(this.data.cat, 10, this.data.songMenuList.length)
  }

})