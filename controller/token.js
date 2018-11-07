var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");
var qiniu = require("qiniu");

var config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "token.json")));
var mac = new qiniu.auth.digest.Mac(config.AccessKey, config.SecretKey);

var putExtra = new qiniu.form_up.PutExtra();
var options = {
  scope: config.Bucket,
  deleteAfterDays: 1,
  returnBody:
//   '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
    '{"key":"$(key)","hash":"$(etag)","url":"http://ph4x1bazq.bkt.clouddn.com/$(key)"}'
};

var putPolicy = new qiniu.rs.PutPolicy(options);
var bucketManager = new qiniu.rs.BucketManager(mac, config);

// router.get('/index.html', function(req, res) {
//     res.sendFile(__dirname + "/" + "index.html");
// });

// router.get('/api/getImg', function(req, res) {
//     var options = {
//         limit: 5,
//         prefix: 'image/test/',
//         marker: req.query.marker
//     };
//     bucketManager.listPrefix(config.Bucket, options, function(err, respBody, respInfo) {
//         if(err) {
//             console.log(err);
//             throw err;
//         }

//         if(respInfo.statusCode == 200) {
//             var nextMarker = respBody.marker || '';
//             var items = respBody.items;
//             res.json({
//                 items: items,
//                 marker: nextMarker
//             });
//         } else {
//             console.log(respInfo.statusCode);
//             console.log(respBody);
//         }
//     });
// });

router.get("/getToken", function(req, res) {
  //  res.send('Hello World!');

  var token = putPolicy.uploadToken(mac);
  res.header("Cache-Control", "max-age=0, private, must-revalidate");
  res.header("Pragma", "no-cache");
  res.header("Expires", 0);
  if (token) {
    res.json({
      code: 200,
      uptoken: token
      // domain: config.Domain
    });
  }
});
module.exports = router;