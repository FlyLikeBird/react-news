var https = require('https');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs'); //用来操作文

var url = 'https://www.zcool.com.cn/discover/33!3!36!0!0!!!!2!-1!8';
var i = 100;

function fetchSource(url){
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
        $('.work-list-box .card-img img').each(function(index, item){
          //获取图片属性
          //console.log(item);
          i++;
          var imgName = i + '.jpeg';
          var src = $(this).attr('src');
          src = src.replace(/@.*/,'');

          //通过管道的方式用fs模块将图片写到本地的images文件下
          request(src).pipe(fs.createWriteStream('./src/images/thumbnails/'+imgName));
        })
         
      })
      
    })
}

fetchSource(url);