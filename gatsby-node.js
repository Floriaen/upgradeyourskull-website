// https://github.com/gatsbyjs/gatsby/discussions/31311
const express = require("express");
// Enable development support for serving HTML from `./static` folder
exports.onCreateDevServer = ({ app }) => {
    app.use(express.static("static"));
}