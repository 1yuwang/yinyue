// pages/detail-song/index.js
import {
  rankingStore,
  playerStore
} from "../../store/index.js"
import {
  getSongMenuDetail
} from "../../service/api_music"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    ranking: "",
    songInfo: {},
  },

  onLoad: function (options) {
    const type = options.type;
    this.setData({
      type
    })
    if (type === "menu") {
      const id = options.id;
      getSongMenuDetail(id).then(res => {
        this.setData({
          songInfo: res.playlist
        })
      })
    } else if (type === "rank") {
      const ranking = options.rankingName
      this.setData({
        ranking
      })
      rankingStore.onState(ranking, this.getRankingDataHandler)
    }

  },

  onUnload: function () {
    if (this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.getRankingDataHandler)

    }
  },

  playerMusic: function (event) {
    const id = event.currentTarget.dataset.id;
    const index = event.currentTarget.dataset.index;
    console.log(index, this.data.songInfo.tracks);
    wx.navigateTo({
      url: '/pages/song-player/index?id=' + id,
    });
    playerStore.dispatch("playMusicWithSongIdAction", {
      id
    })
    playerStore.setState("playListSongs", this.data.songInfo.tracks)
    playerStore.setState("playListIndex", index)
  },

  getRankingDataHandler: function (res) {
    this.setData({
      songInfo: res
    })
  },

})