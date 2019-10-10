var http = require('http');
console.log('hello world222');
http.createServer(function(res,res){
    res.writeHead({'Content-Type':'text/plain'});
    res.end('hello world');
}).listen(8081);