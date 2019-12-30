var express = require('express');
var qiniu = require('qiniu');
var util = require('../util');
var userRouter = require('./user');

var articleRouter = require('./article');
var commentsRouter = require('./comments');
var collectRouter = require('./collect');
var tagRouter = require('./tag');
var topicRouter = require('./topic');
var actionRouter = require('./action');

var router = express.Router();

//  将用户上传的资源传递到七牛云的存储空间 ,为用户生成上传凭证
var accessKey = 'dWnkwLIwmdpo-3UM9x1ckPj5KUbc4gjH-g1sNGkW';
var secretKey = '7rA7dP_289_vQFUJtju8ppRCKeJFYn9AcDgBBQUb';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var config = new qiniu.conf.Config();
config.zone =  qiniu.zone.Zone_z2;
var bucketManager = new qiniu.rs.BucketManager(mac,config);
var bucket = 'react-news';
var options = {
  scope: 'react-news',
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken=putPolicy.uploadToken(mac);

router.get('/token',(req, res, next)=>{
    util.responseClient(res, 200, 0, 'ok', uploadToken);
});
/*
router.get('/deleteImgResource',(req,res)=>{
    var { key, imgUrl } = req.query;
    var deleteOperations = [
      qiniu.rs.deleteOp(bucket, 'FlU53ajp-53bHn20R5SEjQGYn7Dz'),
      qiniu.rs.deleteOp(bucket, 'Ft3d385u5v2U6E4veectfk3NbEUH'),
      qiniu.rs.deleteOp(bucket, 'FuYoKpKMJbz5wMku1_cxdyqVYwyj')
    ];
    bucketManager.batch(deleteOperations,(err, respBody, respInfo)=>{
        console.log('respBody',respBody);
        console.log('respInfo', respInfo);
        if (respInfo.statusCode == 200){
            util.responseClient(res, 200, 0,'ok');
        }
        
    })
    /*
    bucketManager.delete(bucket, key, (err, respBody, respInfo)=>{
        console.log(respBody);
        console.log(respInfo);
        util.responseClient(res, 200, 0, 'ok');
    } )
})
*/

router.use('/usr',userRouter);
router.use('/comment',commentsRouter);
router.use('/article',articleRouter);
router.use('/collect',collectRouter);
router.use('/tag',tagRouter);
router.use('/topic',topicRouter);
router.use('/action',actionRouter);

module.exports = router;