var crypto = require('crypto');

module.exports = {
    
    md5: function (pwd) {
        let md5 = crypto.createHash('md5');
        return md5.update(pwd).digest('hex')
    },
    responseClient(res,httpCode = 500, code = 3,message='服务端异常',data={}) {
        //console.log('response');
        let responseData = {};
        responseData.code = code;
        responseData.message = message;
        responseData.data = data;
        res.status(httpCode).json(responseData)
    },
    translateTag:function(tag){
        var result = '';
        switch(tag){
            case 'shehui':
                result = '社会';
                break;
            case 'guonei':
                result = '国内';
                break;
            case 'guoji':
                result = '国际';
                break;
            case 'yule':
                result = '娱乐';
                break;
            case 'tiyu':
                result = '体育';
                break;
            case 'keji':
                result = '科技';
                break;
        }
        return result ;
    },
    translateType:function(type){
        var text='';
        switch(type){
            case 'topic':
                text = '话题';
                break;
            case 'news':
                text = '新闻';
                break;
            case 'collect' :
                text = '收藏夹';
                break;
            case 'comment' :
                text = '评论';
                break;
            case 'action':
                text='动态';
                break;
    
        }
        return text;
    }

}