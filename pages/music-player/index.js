// pages/music-player/index.js
import {
  getMusicDetail
} from "../../service/api_music"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusHeight: 20,
    currentSong: {},

    innerAudioContext: null,
    // 是否暂停或停止转改
    paused: false,
    // 歌曲总时长
    durationTime: 0,
    // 歌曲当前播放时长
    currentTime: 0,
    // 滑动条进度
    sliderValue: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.getStatusHeight()
    this.loadData(id)
    const innerAudioContext = wx.createInnerAudioContext()
    this.setData({
      innerAudioContext
    })
    // 自动播放
    innerAudioContext.autoplay = true
    this.setData({
      paused: false
    })
    innerAudioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    innerAudioContext.onCanplay(() => {
      innerAudioContext.play()
    })
    // 监听音频播放进度更新事件
    innerAudioContext.onTimeUpdate((e) => {
      const currentTime = innerAudioContext.currentTime
      this.setData({
        currentTime: currentTime * 1000
      })
      this.setData({
        sliderValue: currentTime * 1000 / this.data.durationTime * 100
      })
    })
  },

  getStatusHeight: function () {
    const info = wx.getSystemInfoSync()
    this.setData({
      statusHeight: info.statusBarHeight
    })
  },

  loadData: function (id) {
    getMusicDetail(id).then(res => {
      const currentSong = res.songs[0]
      this.setData({
        currentSong
      })
      // 设置歌曲总时长
      this.setData({
        durationTime: currentSong.dt
      })

    })
  },

  // 事件处理
  hanldeBackClick: function () {
    wx.navigateBack()
  },

  controlPlayStatus: function () {
    if (this.data.paused) {
      this.data.innerAudioContext.play()
    } else {
      this.data.innerAudioContext.pause()
    }
    this.setData({
      paused: !this.data.paused
    })
  },

  handleSliderChange: function (event) {
    const value = event.detail.value
    const duration = this.data.durationTime
    const time = value * (duration / 100)
    this.setData({
      currentTime: time
    })
    this.data.innerAudioContext.seek(time / 1000)
  }
})