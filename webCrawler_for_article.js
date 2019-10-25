var https = require('https');
var request = require('request');
var cheerio = require('cheerio');

var Topic = require('./models/Topic');
var Action = require('./models/Action');
var Tag = require('./models/Tag');
var Article = require('./models/Article');
var User = require('./models/User');
var Comment = require('./models/Comment');

var fs = require('fs'); //用来操作文
var source = ['war','tech']
var url = 'https://war.163.com' //定义要爬的页面
var i = 29;

function _createArticleModel(option){
    var { } = option;
    var article = new Article({

    })
}

function fetchDetailHtml(url){
    //console.log(url);
}
// http 模块向指定url发起get请求
function fetchSource(url){
    console.log(url);
    https.get(url,function(res){
      var html = '';
      var titles = [];
      res.setEncoding('utf-8') //防止中文乱码
      res.on('data',function(chunk){
        html += chunk;    //监听data事件 每次取一块数据
      })   

      res.on('end',function(){
        var $ = cheerio.load(html);  //获取数据完成后，解析html
        //将获取的图片存到images文件夹中
        //console.log(html);
        $('script[typ').each(function(index, item){
          //获取图片属性
          console.log(item);
          var href = $(this).attr('href');
          //console.log(href);
          fetchDetailHtml(href);
          //通过管道的方式用fs模块将图片写到本地的images文件下
            //request(imgSrc).pipe(fs.createWriteStream('./images/' + imgfile));
        })
         
      })
      
    })
}

function start(arr){
    if(arr){
        var source = arr.map(item=>`https://${item}.163.com`);
        source.map(url=>fetchSource(url))
    }
}

start(source);