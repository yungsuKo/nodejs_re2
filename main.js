// 웹브라우저 <> 웹 서버
// 

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body,controller){
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
      ${controller}
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

  console.log(url.parse(_url,true).pathname)

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
          `,
          `
          <p><a href="/create"> create </a></p>
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
            `,
            `
            <p>
              <a href="/create"> create</a>
              <a href="/update?id=${title}"> update </a>
            </p>
            <form action="/delete_process" method = "post">
              <input type="hidden" name = "id" value = "${title}">
              <input type="submit" value = "delete">
            </form>
            
            `
          );
        response.writeHead(200);
        response.end(template);
        })
      });
    }
  }
  else if(pathname === "/create"){
    fs.readdir('./data', function(error, filelist){
      console.log(filelist)
      var title = 'Welcome';
      var description = 'Hello NodeJS!'

      var list = templateList(filelist);
      var template = templateHTML(title, list, 
        `
        <form action="http://localhost:3000/create_process" method="post">
        <p><input type="text" name="title" placeholder = "title"></p>
        <p>
            <textarea name = "description" placeholder = "description"></textarea>
        </p>
        <p>
            <input type = "submit">
        </p>
        </form>
        `,
        ``
      );
      response.writeHead(200);
      response.end(template);
    })
  }
  else if(pathname === "/create_process"){
    var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      
      fs.writeFile(`data/${title}`, description, 'utf8',function(err){
        response.writeHead(302, {
          'Location' : `/?id=${title}`
        });
        response.end();
        // file written successfully
      });
    });
  }
  // update start
  else if(pathname === `/update`){
    fs.readdir('./data', function(error, filelist){
      fs.readFile(`data/${queryData.id}`, 'utf8', function(error, description){
        var title = queryData.id;
        var id = title;
        var list = templateList(filelist);
        var template = templateHTML(title, list, 
        `
          <form action="http://localhost:3000/update_process" method="post" >
            <input type="hidden" name="id" value="${id}">
            <p><input type="text" name="title" placeholder = "title" value="${title}"></p>
            <p>
              <textarea name = "description" placeholder = "description">${description}</textarea>
            </p>
            <p>
              <input type = "submit">
            </p>
          </form>
        `,
        ``
        );
      response.writeHead(200);
      response.end(template);
      })
    });
  }
  else if(pathname === "/update_process"){
    var body = '';
    request.on('data', function(data){
      body = body + data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      console.log(post);
      var title = post.title;
      var id = post.id;
      var description = post.description;
      
      fs.rename(`./data/${id}`, `./data/${title}`, function(err){
        console.log('File Renamed!');
        fs.writeFile(`data/${title}`, description, 'utf8',function(err){
          response.writeHead(302, {
            'Location' : `/?id=${title}`
          });
          response.end();
          // file written successfully
        });
      });
    });
  }
  else if(pathname === "/delete_process"){
    var body = '';
    request.on('data', function(data){
      body = body + data;
      console.log("body = ",body);
    });
    request.on('end', function(){
      var post = qs.parse(body);
      console.log(post);
      var title = post.id;

      fs.unlink(`data/${title}`,function(err){
        response.writeHead(302, {
          'Location' : `/`
        });
        response.end();
        // file deleted successfully
      });
    });
  }
  else{
    response.writeHead(404);
    response.end('Not found');
  }
});
app.listen(3000);