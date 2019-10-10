var http = require('http');
console.log('hello world222');
http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end('hello world');
}).listen(8081);