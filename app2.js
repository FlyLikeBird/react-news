var http = require('http');

http.createServer((res,res)=>{
    res.writeHead({'Content-Type':'text/plain'});
    res.end('hello world');
}).listen(8081);