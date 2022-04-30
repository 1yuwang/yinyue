// pages/song-player/index.js
import {
  audioContext,
  playerStore
} from "../../store/index"

const playModeNames = ['order', 'repeat', 'random']

Page({

  data: {
    // 传入的id
    id: 0,
    currentSong: {},
    lyricInfos: [],
    durationTime: 0,


    currentTime: 0,
    currentLyricText: "",
    currentLyricIndex: 0,

    isPlaying: false,

    playModeIndex: 0,
    playModeName: "order",

    sliderValue: 0,
    // 当前歌曲
    contentHeight: 0,
    isSliderChanging: false,
    lyricScrollTop: 0
  },
  onLoad: function (options) {
    // 1.获取传入id
    const id = options.id
    this.setData({
      id
    })
    // 2.根据id获取歌曲信息
    this.setupPlayerStoreListener()

    // 动态计算内容高度
    const app = getApp()
    const screenHeight = app.globalData.screenHeight;
    const statusBarHeight = app.globalData.statusBarHeight;
    const contentHeight = screenHeight - statusBarHeight - 44;
    this.setData({
      contentHeight
    })


    // 当音乐从服务器获取完成， 完成解码等准备工作之后回调

  },

  // 事件处理
  handleSwiperChange: function (event) {
    const currentPage = event.detail.current
    this.setData({
      currentPage
    })
  },
  hanldeSliderChange: function (event) {
    // 获取slider变化的值
    const value = event.detail.value;
    // 计算需要播放的currentTime
    const currentTime = this.data.durationTime * value / 100;
    // audioContext.pause()
    audioContext.seek(currentTime / 1000)
    this.setData({
      sliderValue: value,
    })

    this.setData({
      isSliderChanging: false
    })
  },
  hanldeSliderChanging: function (event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({
      isSliderChanging: true,
      currentTime
    })
  },
  handleBackClick: function () {
    wx.navigateBack()
  },
  hanldeModeBtnClick: function () {
    // 计算最新的palyModeIndex
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0

    // 设置playerStore中的playModeIndex
    playerStore.setState("playModeIndex", playModeIndex)
  },
  hanldePlayBtnClick: function () {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },

  handlePrevBtnClick: function () {
    playerStore.dispatch("changeNewMusicAction", false)
  },
  handleNextBtnClick: function () {
    playerStore.dispatch("changeNewMusicAction")
  },

  // 数据的监听
  setupPlayerStoreListener: function () {
    // 监听currentSong", "durationTime", "lyricInfos
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if (currentSong) this.setData({
        currentSong
      })
      if (durationTime) this.setData({
        durationTime
      })
      if (lyricInfos) this.setData({
        lyricInfos
      })
    })

    // 监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(['currentTime', 'currentLyricIndex', 'currentLyricText'], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({
          currentTime,
          sliderValue
        })
      }
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({
          currentLyricIndex,
          lyricScrollTop: currentLyricIndex * 35
        })
      }
      if (currentLyricText) {
        this.setData({
          currentLyricText
        })
      }
    })

    // 监听播放模式相关的数据
    playerStore.onStates(["playModeIndex", "isPlaying"], ({
      playModeIndex,
      isPlaying
    }) => {
      if (playModeIndex !== undefined) {
        this.setData({
          playModeIndex,
          playModeName: playModeNames[playModeIndex]
        })
      }
      if (isPlaying !== undefined) {
        this.setData({
          isPlaying
        })
      }
    })


  }
})