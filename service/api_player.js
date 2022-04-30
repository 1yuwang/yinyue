import ywRequest from "./index"

export function getSongDetail(ids) {
  return ywRequest.get("/song/detail", {
    ids
  })
}

export function getSongLyric(id) {
  return ywRequest.get("/lyric", {
    id
  })
}