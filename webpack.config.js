var path = require("path")
var webpack = require("webpack")

module.exports = {
  entry: "./source/main.ts",
  output: {
    path: path.resolve(__dirname, "./app"),
    filename: "bundle.js"
  },
  mode: "development"
}
