// 웹브라우저 <> 웹 서버
// 

var http = require('http');
var fs = require('fs');
var url = require('url')

function templateHTML(title, list, body){
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">        
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${body}
    </body>
    </html>    
  `;
}

function templateList(filelist){
  var list = '<ul>'
  var i = 0
  while(i < filelist.length){
    list = list + `<li><a href='/?id=${filelist[i]}'>${filelist[i]}</a></li>`
    i = i + 1;
  }
  list = list + '</ul>'
  return list;
}


var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url,true).pathname

  console.log(url.parse(_url,true),pathname)

  if(pathname === '/'){
    if(queryData.id === undefined){
      fs.readdir('./data', function(error, filelist){
        console.log(filelist)
        var title = 'Welcome';
        var description = 'Hello NodeJS!'

        var list = templateList(filelist);
        var template = templateHTML(title, list, 
          `
          <h2>${title}</h2>
          <p>
            ${description}
          </p>
          `
        );
        response.writeHead(200);
        response.end(template);
      })
    } 
    else {
      fs.readdir('./data', function(error, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(error, description){
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, 
            `
            <h2>${title}</h2>
            <p>
              ${description}
            </p>
            `
          );
        response.writeHead(200);
        response.end(template);
        })
      });
    }
  }else{
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);