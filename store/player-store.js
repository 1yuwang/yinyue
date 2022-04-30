import {
  HYEventStore
} from "hy-event-store"
import {
  getSongDetail,
  getSongLyric
} from "../service/api_player"
import {
  parseLyric
} from "../utils/parse-lyric"
// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true,
    isStoping: false,

    id: 0,
    currentSong: {},
    durationTime: 0,
    lyricInfos: [],

    currentTime: 0,
    currentLyricText: "",
    currentLyricIndex: 0,

    isPlaying: false,

    playModeIndex: 0, // 0：循环播放，1：单曲循环，2：随机播放
    playListSongs: [], // 歌曲列表
    playListIndex: 0 // 当前歌曲索引
  },
  actions: {
    playMusicWithSongIdAction(ctx, {
      id,
      isRefresh = false
    }) {
      if (ctx.id === id && !isRefresh) {
        this.dispatch("changeMusicPlayStatusAction", true)
        return
      }
      ctx.id = id

      ctx.isPlaying = true;
      ctx.currentSong = {};
      ctx.durationTime = 0;
      ctx.lyricInfos = [];
      ctx.currentTime = 0;
      ctx.currentLyricIndex = 0;
      ctx.currentLyricText = ""

      // 修改播放的状态
      ctx.isPlaying = true

      // 请求歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })
      // 请求歌词
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyric = parseLyric(lyricString)
        ctx.lyricInfos = lyric
      })

      // 播放对应id的歌曲
      // 创建播放器 
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.title = id
      audioContext.autoplay = true

      // 监听audioContext一些事件
      if (ctx.isFirstPlay) {
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false
      }
    },
    setupAudioContextListenerAction(ctx) {
      // 监听歌词可以播放
      audioContext.onCanplay(() => {
        audioContext.play()
      })
      // 监听时间变化
      audioContext.onTimeUpdate(() => {
        // 获取当前时间
        const currentTime = audioContext.currentTime * 1000;
        ctx.currentTime = currentTime

        // // 根据当前时间修改currentTime/sliderValue
        // if (!this.data.isSliderChanging) {
        //   const sliderValue = currentTime / this.data.durationTime * 100
        //   this.setData({
        //     sliderValue,
        //     currentTime
        //   })
        // }
        // 根据当前时间去查找播放的歌词
        for (let i = 0; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if (currentTime < lyricInfo.time) {

            // 设置当前歌词的索引和内容
            const currentIndex = i - 1
            if (ctx.currentLyricIndex !== currentIndex) {
              const currentLyricInfo = ctx.lyricInfos[currentIndex]
              // this.setData({
              //   currentLyricText: currentLyricInfo.text,
              //   currentLyricIndex: currentIndex,
              //   lyricScrollTop: currentIndex * 35
              // })
              ctx.currentLyricIndex = currentIndex;
              ctx.currentLyricText = currentLyricInfo.text
            }

            break
          }
        }
      })
      // 监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction")
      })
      // 监听音乐暂停/播放/停止
      // 播放状态
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      // 暂停状态
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
      // 停止状态
      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStoping = true
      })
    },
    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      if (ctx.isPlaying && ctx.isStoping) {
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`;
        audioContext.title = currentSong.name
        ctx.isStoping = false
      }
      if (ctx.isPlaying) {
        audioContext.play()
      } else {
        audioContext.pause()
      }
    },

    changeNewMusicAction(ctx, isNext = true) {
      // 获取当前歌曲索引
      let index = ctx.playListIndex;

      // 根据不同的播放模式， 获取下一首歌的索引
      switch (ctx.playModeIndex) {
        case 0: // 顺序播放
          index = isNext ? index + 1 : index - 1
          if (index === -1) index = ctx.playListSongs.length - 1
          if (index === ctx.playListSongs.length) index = 0
          break;
        case 1: // 单曲循环
          break;
        case 2: // 随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break;
      }
      // 获取歌曲
      let currentSongs = ctx.playListSongs[index]
      if (!currentSongs) {
        currentSongs = ctx.currentSong
      } else {
        ctx.playListIndex = index
      }

      // 播放新的歌曲
      this.dispatch("playMusicWithSongIdAction", {
        id: currentSongs.id,
        isRefresh: true
      })
    }

  }
})
export {
  audioContext,
  playerStore
}