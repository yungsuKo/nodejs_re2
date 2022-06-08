// 웹브라우저 <> 웹 서버
// 

var http = require('http');
var fs = require('fs');
var app = http.createServer(function(request,response){
    var url = request.url;
    console.log(url);
    if(url == '/'){
      url = '/index.html';
    }
    if(url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
    if(url == '/favicon.ico'){
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200);
    console.log(__dirname + url);
    response.end(fs.readFileSync(__dirname + url));
 
});
app.listen(3000);