// components/song-item-v1/index.js
import {
  playerStore
} from "../../store/index"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemClick(event) {
      const id = event.currentTarget.dataset.id
      // 跳到播放页
      wx.navigateTo({
        url: '/pages/song-player/index?id=' + id,
      })
      // 对歌曲的数据请求和其他操作
      playerStore.dispatch("playMusicWithSongIdAction", {
        id
      })
    }
  }
})