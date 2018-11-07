const mongoose = require("mongoose");
mongoose.connect(
    "mongodb://localhost/blog",
    { useNewUrlParser: true }
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:mongodb连接失败"));
db.once("open", function() {
    console.log("连接成功");
});

db.on("disconnected", function() {
    console.log("mongodb连接断开");
});
module.exports = db;
