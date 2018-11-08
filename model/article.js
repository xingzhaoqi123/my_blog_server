const mongoose = require("mongoose");
var articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true
        },
        author: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "user"
        },
        content: String,
        desc: String,
        sourse: Number,
        visible: Number,
        blogTypes: Array
        // likeCount: {
        //     type: Number,
        //     default: 0
        // },
        // comment: [
        //     {
        //         user: String,
        //         date: String,
        //         text: String
        //     }
        // ]
    },
    {
        versionKey: false,
        timestamps: { createdAt: "createdTime", updatedAt: "updateTime" }
    }
);

module.exports = mongoose.model("article", articleSchema);
