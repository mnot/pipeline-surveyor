#!/usr/bin/env node

var http = require('http')
var path = require("path")
var url = require("url")

var server_port = 80

http.createServer(function (req, res) {

  req.on('end', function () {
    var path = url.parse(request.url).pathname
    var path_segs = path.split("/")
    path_segs.shift()
    
    var seg = path_segs.shift()
    switch (seg) {
      case '': // home page
        break;
      case 'test': // test page
        var name = path_segs.shift()
        res.writeHead(200, {
          'Content-Type': "text/html",
          'Assoc-Req': path
        })
        res.end('1234')
        break;
      default:
        res.writeHead(404, {'content-type': 'text/html'})
        res.end("<html><body><h1>Not Found</h1></body></html>")        
        break;
    }
  })

}).listen(server_port)  
