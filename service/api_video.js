import xhr from "./index"

export function getTopMv(offset, limit = 10) {
  return xhr.get("/top/mv", {
    offset: offset,
    limit: limit
  })
}

export function getMVURL(id) {
  return xhr.get("/mv/url", {
    id
  })
}

export function getMVDetail(mvid) {
  return xhr.get("/mv/detail", {
    mvid
  })
}

export function getRelatedVideo(id) {
  return xhr.get("/related/allvideo", {
    id
  })
}