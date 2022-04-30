// pages/home-music/index.js
import {
  rankingStore,
  playerStore
} from "../../store/index"

import {
  getbanners,
  getSongMenu
} from "../../service/api_music"
import queryRect from "../../utils/queryRect"
import throttle from "../../utils/throttle"
const throttleQueryRect = throttle(queryRect, 1000, {
  trailing: true
})
Page({
  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    swiperHeight: 0,
    recommendSongs: [],
    // 热门
    hotSongMenu: [],
    // 推荐
    recommendSongMenu: [],
    // 古风
    classicalSongMenu: [],
    // 欧美
    eaSongMenu: [],
    // 流行
    popularSongMenu: [],
    rankings: [],
    rankingNames: {
      0: "newRanking",
      1: "originRanking",
      2: "upRanking",
      3: "hotRanking"
    },
    currentSong: {},
    isPlaying: false,
    playAnimState: 'paused'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // playerStore.dispatch("playMusicWithSongIdAction", {
    //   id: 1891469546
    // })

    // 请求图数据
    this.loadData()

    //共享数据的请求
    rankingStore.dispatch("getRankingDataAction")

    // 从store获取共享的数据
    this.setupPlayerStoreListener()
  },

  // 网络请求
  loadData: function () {
    // 获取轮播图
    getbanners().then(res => {
      this.setData({
        banners: res.banners
      })
    })

    // 获取热门歌单
    getSongMenu().then(res => {
      this.setData({
        hotSongMenu: res.playlists
      })
    })

    getSongMenu("华语").then(res => {
      this.setData({
        recommendSongMenu: res.playlists
      })
    })

    getSongMenu("古风").then(res => {
      this.setData({
        classicalSongMenu: res.playlists
      })
    })

    getSongMenu("欧美").then(res => {
      this.setData({
        eaSongMenu: res.playlists
      })
    })

    getSongMenu("流行").then(res => {
      this.setData({
        popularSongMenu: res.playlists
      })
    })


  },

  // 事件处理
  handlerSearchClick: function () {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },

  hanlderSwiperImageLoaded: function (event) {
    throttleQueryRect(".swiper-image").then(res => {
      const rect = res[0]
      this.setData({
        swiperHeight: rect.height
      })
    })
  },

  openMoreClick: function (event) {
    const idx = event.currentTarget.dataset.idx

    this.navigateToDetailSongsPage(idx)
  },

  handleRankingItemClick: function (event) {
    const idx = event.currentTarget.dataset.idx
    this.navigateToDetailSongsPage(idx)
  },

  navigateToDetailSongsPage: function (idx) {
    const name = this.data.rankingNames[idx];
    wx.navigateTo({
      url: `/pages/detail-song/index?rankingName=${name}&type=rank`,
    })
  },

  handleSongItemClick: function (event) {
    const index = event.currentTarget.dataset.index;
    playerStore.setState("playListSongs", this.data.recommendSongs)
    playerStore.setState("playListIndex", index)
  },

  handlePlayBtnClick: function () {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },

  hanldePlayBarClick: function () {
    wx.navigateTo({
      url: '/pages/song-player/index?id=' + this.data.currentSong.id,
    })
  },

  openMore: function (event) {
    const cat = event.currentTarget.dataset.cat;
    wx.navigateTo({
      url: '/pages/song-menu-list/index?cat=' + cat,
    })
  },

  playMusic: function (event) {
    const id = event.currentTarget.dataset.id
    console.log(id);
  },

  setupPlayerStoreListener: function () {
    // 排行榜监听
    rankingStore.onState("hotRanking", res => {
      if (!res.tracks) return
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({
        recommendSongs
      })
    })
    rankingStore.onState("newRanking", this.getRankingHandler)
    rankingStore.onState("originRanking", this.getRankingHandler)
    rankingStore.onState("upRanking", this.getRankingHandler)

    // 播放器监听
    playerStore.onStates(["currentSong", "isPlaying"], ({
      currentSong,
      isPlaying
    }) => {
      if (currentSong) this.setData({
        currentSong
      })
      if (isPlaying !== undefined) this.setData({
        isPlaying,
        playAnimState: isPlaying ? 'running' : 'paused'
      })

    })
  },

  getRankingHandler: function (res) {
    if (Object.keys(res).length === 0) return
    const name = res.name;
    const coverImgUrl = res.coverImgUrl;
    const playCount = res.playCount
    const songList = res.tracks.slice(0, 3);
    const rankingObj = {
      name,
      coverImgUrl,
      playCount,
      songList
    };
    // const originRankings = [...this.data.rankings];
    // originRankings.push(rankingObj)
    this.setData({
      rankings: [...this.data.rankings, rankingObj]
    })
  }

})