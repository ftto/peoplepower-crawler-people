const prettyjson = require("prettyjson")

module.exports = function printJson(object, options = {}) {
  console.log(prettyjson.render(object, options))
}
