var express = require("express");
var router = express.Router();

router.use("/blog", require("../controller/blog"));
router.use("/user", require("../controller/user"));
router.use("/", require("../controller/token"));
module.exports = router;
