var express = require("express");
var router = express.Router();
const blogModel = require("../model/article");
//获取博客列表的总条数
router.get("/total", async (req, res, next) => {
    try {
        const total = await blogModel.find().count();
        res.json({
            code: 200,
            total
        });
    } catch (err) {
        next(err);
    }
});
//获取所有博客的列表
router.get("/list", async (req, res, next) => {
    try {
        let { page = 1, page_size = 8 } = req.query;
        page = parseInt(page);
        page_size = parseInt(page_size);
        const data = await blogModel
            .find()
            .sort({ _id: -1 })
            .skip((page - 1) * page_size)
            .limit(page_size)
            .populate({ path: "author", select: "-pwd" });
        res.json({
            code: 200,
            data,
            total: data.length,
            msg: "获取成功"
        });
    } catch (err) {
        res.json({
            code: 400,
            msg: "未知错误"
        });
        next(err);
    }
});
//更改博客文章
router.put("/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        let { title, content, desc, sourse, visible, blogTypes } = req.body;
        const data = await blogModel.findByIdAndUpdate(
            id,
            { title, content, desc, sourse, visible, blogTypes },
            { new: true }
        );
        res.json({
            code: 200,
            data,
            msg: "更改成功"
        });
    } catch (err) {
        res.json({
            code: 400,
            msg: "更改失败"
        });
        next(err);
    }
});
//删除某篇博客
router.delete("/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        const data = await blogModel.deleteOne({ _id: id });
        res.json({
            code: "200",
            msg: "删除成功"
        });
    } catch (err) {
        res.json({
            code: "400",
            msg: "删除失败"
        });
        next(err);
    }
});
//添加博客文章
router.post("/add", async (req, res, next) => {
    try {
        let {
            title,
            author,
            content,
            desc,
            sourse,
            visible,
            blogTypes
        } = req.body;
        const data = await blogModel.create({
            title,
            author,
            content,
            desc,
            sourse,
            visible,
            blogTypes
        });
        res.json({
            code: 200,
            data,
            msg: "添加成功"
        });
    } catch (err) {
        res.json({
            code: 400,
            msg: "参数错误"
        });
        next(err);
    }
});
//获取某一篇博客
router.get("/person/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        const data = await blogModel
            .findOne({ _id: id })
            .populate({ path: "author", select: "-pwd" });
        res.json({
            code: 200,
            data,
            msg: "获取成功"
        });
    } catch (err) {
        res.json({
            code: 400,
            msg: "获取失败"
        });
        next(err);
    }
});
module.exports = router;
