export default {
  host: "http://watch.peoplepower21.org",
  listCrawler: {
    maxPage: 1,
    maxConnections: 1,
    rateLimit: 5000
  },
  detailCrawer: {
    maxConnections: 1,
    rateLimit: 100
  }
}
