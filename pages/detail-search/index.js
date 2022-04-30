// pages/detail-search/index.js
import {
  getSearchHot,
  getSearchSuggest,
  getSearchResult
} from "../../service/api.search"
import {
  debounce
} from "../../utils/debounce"
import {
  stringToNodes
} from "../../utils/string-to-nodes"
import localCache from "../../utils/localCache"
import {playerStore} from "../../store/index"
const debounceGetSearchSuggest = debounce(getSearchSuggest, 300)
Page({

  data: {
    hotKeywords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: [],
    searchValue: "",
    // 历史搜索
    historySearch: [],
    navBarTitles: ["单曲", "专辑", "歌手", "歌单", "用户", "MV"],
    navBarCurrentIndex: 0,
    mode: "single"
  },

  onLoad: function (options) {
    this.loadData()
  },

  loadData: function () {
    // 获取热门搜索
    getSearchHot().then(res => {
      this.setData({
        hotKeywords: res.result.hots
      })
    })

    // 从本地缓存中获取历史搜素
    const historySearch = localCache.getCache("historySearch")
    if (!historySearch) {
      return
    }
    this.setData({
      historySearch
    })
  },

  handleSearchChange: function (event) {
    const searchValue = event.detail;
    this.setData({
      searchValue
    })
    if (!searchValue.length) {
      this.setData({
          suggestSongs: []
        }),
        this.setData({
          resultSongs: []
        })
      debounceGetSearchSuggest.cancel()
      return
    }

    // 根据关键字进行搜索
    debounceGetSearchSuggest(searchValue).then(res => {
      // 获取建议的关键字歌曲
      const suggestSongs = res.result.allMatch
      this.setData({
        suggestSongs
      })
      if (!suggestSongs) return

      // 转成nodes节点
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for (const keyword of suggestKeywords) {
        const nodes = stringToNodes(keyword, searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({
        suggestSongsNodes
      })

    })
  },
  handleSearchAction: function (type) {
    const searchValue = this.data.searchValue;
    getSearchResult(searchValue, type).then(res => {
      console.log(res);
      switch (type) {
        case 10:
          this.setData({
            resultSongs: res.result.albums
          })
          break;
        default:
          this.setData({
            resultSongs: res.result.songs
          })
          break;
      }
    })

    // 如果第一次使用没有历史搜索缓存则返回
    // if (!this.data.historySearch) return

    // 搜索返回结果后 保存已搜索内容到历史搜索，并存入本地缓存
    const historySearch = this.data.historySearch.filter((item) => item !== searchValue)
    this.setData({
      historySearch: [searchValue, ...historySearch]
    })
    localCache.setCache("historySearch", this.data.historySearch)
  },
  handleSuggestItemClick: function (event) {
    const index = event.currentTarget.dataset.index
    const keyword = this.data.suggestSongs[index].keyword
    this.setData({
      searchValue: keyword
    })
    this.handleSearchAction()
  },
  handleTagItemClick: function (event) {
    const keyword = event.currentTarget.dataset.keyword
    this.setData({
        searchValue: keyword
      }),
      this.handleSearchAction()
  },

  hanldeResultSongsItemClick: function (event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/music-player/index?id=' + id,
    });
    // 对歌曲的数据请求和其他操作
    playerStore.dispatch("playMusicWithSongIdAction", {
      id
    })
  },

  // load
  hanldeNavBarItemClick: function (event) {
    const navBarCurrentIndex = event.currentTarget.dataset.index
    this.setData({
      navBarCurrentIndex
    })
    switch (navBarCurrentIndex) {
      case 0:
        this.handleSearchAction()
        this.setData({
          mode: "single"
        })
        break;
      case 1:
        this.handleSearchAction(10)
        this.setData({
          mode: "album"
        })
        break;
      case 2:
        this.handleSearchAction(100)
        this.setData({
          mode: "singer"
        })
        break
      default:
        break;
    }
  }
})