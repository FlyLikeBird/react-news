var express = require('express');
var usrRouter = require('./user');
var articleRouter = require('./article');
var commentsRouter = require('./comments');
var collectRouter = require('./collect');
var tagRouter = require('./tag');
var topicRouter = require('./topic');
var actionRouter = require('./action');

var router = express.Router();

router.use('/usr',usrRouter);
router.use('/comment',commentsRouter);
router.use('/article',articleRouter);
router.use('/collect',collectRouter);
router.use('/tag',tagRouter);
router.use('/topic',topicRouter);
router.use('/action',actionRouter);

module.exports = router;