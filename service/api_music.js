import ywRequest from "./index"

// swiper image api
export function getbanners(type = 2) {
  return ywRequest.get("/banner", {
    type
  })
}

// 歌曲排行
export function getRankings(idx) {
  return ywRequest.get("/top/list", {
    idx
  })
}

// 歌单
export function getSongMenu(cat = "全部", limit = 6, offset = 0) {
  return ywRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}

// export function getHotSongSheet() {
//   return ywRequest.get("/personalized")
// }

// 歌单详情
export function getSongMenuDetail(id) {
  return ywRequest.get("/playlist/detail/dynamic", {
    id
  })
}

// // music detail api
export function getMusicDetail(ids) {
  return ywRequest.get("/song/detail", {
    ids
  })
}

// // lyric api
// export function getLyric(id) {
//   return ywRequest.get("/lyric", {
//     id
//   })
// }