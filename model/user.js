const mongoose = require("mongoose");
var userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
        },
        pwd: {
            type: String,
            required: true
        },
        avatar: String,
        roles: Array,
        nickname: String
    },
    {
        versionKey: false,
        timestamps: { createdAt: "createdTime", updatedAt: "updateTime" }
    }
);

module.exports = mongoose.model("user", userSchema);
