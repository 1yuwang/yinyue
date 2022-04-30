// components/song-menu-area/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ""
    },
    songMenu: {
      type: Array,
      value: []
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
    handleMenuItemClick: function (event) {
      const id = event.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/detail-song/index?id=${id}&type=menu`,
      })
    },

    openSongMenuList: function () {
      this.triggerEvent("openMore")
    }
  }
})