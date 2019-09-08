var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var util = require('../util');

var Tag = require('../../models/Tag');
var Article = require('../../models/Article');
var User = require('../../models/User');

router.get('/getAllTags',(req,res)=>{

  Tag.find({},(err,tags)=>{
    util.responseClient(res,200,0,'ok',tags);
  })
})


module.exports = router;