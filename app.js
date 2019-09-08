

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var reload = require('reload');
var rootPath = __dirname;
var indexRouter = require('./server/api');
var mongoose = require('mongoose');
var path = require('path');
var config = require('./config/config');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var socketIndex = require('./server/api/socket');
var webpack = require("webpack"),
    webpackConfig = require("./webpack.config"),
    webpackDevMiddleware = require("webpack-dev-middleware"),
    webpackHotMiddleware = require("webpack-hot-middleware");
var compiler = webpack(webpackConfig);

//console.log(compiler);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('react-news'));
app.use(session({
    secret:'react-news',
    resave: true,
    saveUninitialized:true,
    cookie: {maxAge: 60 * 1000 * 30}//过期时间
}));


app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    stats: {
      colors: true
    }
  })
);

app.use(webpackHotMiddleware(compiler));


app.use(express.static(path.resolve('./src/images')));
app.use(express.static(path.resolve(__dirname,'./dist')));

app.use('/', indexRouter)

//  解决跨域问题
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('*', function ( req, res){
   //console.log(path.resolve(__dirname, './dist', 'index.html'));
   //console.log('other requests!!');
   res.sendFile(path.resolve(__dirname, './dist', 'index.html'))
   //res.sendFile(path.resolve(__dirname,'./src/index.html'));
});

reload(app);


server.listen(8080, () => {
  console.log('* Server starting...');
});

io.on('connection',(socket)=>{
  socketIndex(socket,io);
});


mongoose.connect(`mongodb://${config.dbHost}:${config.dbPort}/react-news`, function (err) {
    if (err) {
        console.log(err, "数据库连接失败");
        return;
    }
    console.log('数据库连接成功');
   
});

