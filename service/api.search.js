import ywRequest from "./index"

export function getSearchHot() {
  return ywRequest.get("/search/hot")
}

export function getSearchSuggest(keywords) {
  return ywRequest.get("/search/suggest", {
    keywords,
    type: "mobile"
  })
}

export function getSearchResult(keywords, type = 1) {
  return ywRequest.get("/search", {
    keywords,
    type
  })
}