var express = require("express");
var router = express.Router();
const userModel = require("../model/user");
var JwtUtil = require("../public/utils/jwt");
var auth = require("./auth");
router.delete("/:id", auth, async (req, res, next) => {
    try {
        let { id } = req.params;
        const data = await userModel.deleteOne({ _id: id });
        res.json({
            code: 200,
            msg: "删除成功"
        });
    } catch (err) {
        res.json({
            code: 400,
            msg: "删除失败"
        });
        next(err);
    }
});
router.get("/person/:id", auth, async (req, res, next) => {
    try {
        let { id } = req.params;
        const data = await userModel.findById({ _id: id }).select("-pwd");
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
router.put("/:id", auth, async (req, res, next) => {
    try {
        let { id } = req.params;
        let { avatar, nickname, username } = req.body;
        const data = await userModel.findByIdAndUpdate(
            id,
            { avatar, nickname, username },
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
router.put("/person/:id", auth, async (req, res, next) => {
    try {
        let { id } = req.params;
        let { username, pwd, avatar, nickname } = req.body;
        const data = await userModel.findByIdAndUpdate(
            id,
            { username, pwd, avatar, nickname },
            { new: true }
        );
        res.json({
            code: 200,
            data,
            msg: "更改成功"
        });
    } catch (err) {
        next(err);
        res.json({
            code: 400,
            msg: "更改失败"
        });
    }
});
//获取列表条数
router.get("/total", auth, async (req, res, next) => {
    try {
        const total = await userModel.find().count();
        res.json({
            code: 200,
            total
        });
    } catch (err) {
        next(err);
    }
});
//获取用户列表
router.get("/list", auth, async (req, res, next) => {
    try {
        let { page = 1, page_size = 8 } = req.query;
        page = parseInt(page);
        page_size = parseInt(page_size);
        const data = await userModel
            .find()
            .sort({ _id: -1 })
            .skip((page - 1) * page_size)
            .limit(page_size);
        res.json({
            code: 200,
            data,
            msg: "获取成功"
        });
        // res.json({
        //     code: 200,
        //     data,
        //     total: getTotal.length,
        //     msg: "获取成功"
        // });
    } catch (err) {
        res.json({
            code: 400,
            msg: "获取失败"
        });
        next(err);
    }
});
router.post("/add", auth, async (req, res, next) => {
    try {
        const { username, pwd, avatar, nickname, roles } = req.body;
        const data = await userModel.create({
            username,
            pwd,
            avatar,
            nickname,
            roles
        });
        res.json({
            code: 200,
            data,
            msg: "添加成功"
        });
    } catch (err) {
        res.json({
            code: 400,
            msg: "添加失败"
        });
        next(err);
    }
});
router.get("/logout", (req, res, next) => {
    if (req.session.user) {
        req.session.user = null;
        res.json({
            code: 200,
            msg: "退出登录成功"
        });
    } else {
        res.json({
            code: 403,
            msg: "不能在未登录状态下退出登录"
        });
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const { username, pwd } = req.body;
        const loginData = await userModel.findOne({ username });
        if (!loginData) {
            res.json({
                code: 400,
                msg: "用户不存在"
            });
        } else {
            if (pwd && pwd == loginData.pwd) {
                req.session.user = loginData;

                let _id = loginData._id.str;
                let jwt = new JwtUtil(_id);
                let token = jwt.generateToken();

                res.json({
                    code: 200,
                    msg: "登陆成功",
                    token: token,
                    loginData
                });
            } else {
                res.json({
                    code: 400,
                    msg: "密码不正确"
                });
            }
        }
    } catch (err) {
        res.json({
            code: 400,
            msg: err
        });
        next(err);
    }
});
module.exports = router;
