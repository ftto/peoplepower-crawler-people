import prettyjson from "prettyjson"

export default function printJson(object, options = {}) {
  console.log(prettyjson.render(object, options))
}
