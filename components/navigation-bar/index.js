// components/navigation-bar/index.js
Component({

  properties: {
    currentPage: {
      type: Number,
      value: 0
    }
  },
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
  },

  lifetimes: {

  },

  methods: {
    handleLeftClick: function() {
      this.triggerEvent("click")
    }
  }
})