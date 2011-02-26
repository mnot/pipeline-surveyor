#!/usr/bin/env node

// Server side for pipeline surveyor.

var net = require('net');
var parse_messages = require('pipeline-surveyor').parse_messages;


var server_port = 80;

var srv = net.createServer(function(c) {
  c.setEncoding('ascii');
  var buf = "";

  // send four responses over two immediately subsequent packets.
  c.addListener('connect', function () {
    c.setNoDelay(true);
    c.write(
      'HTTP/1.1 200\r\n' +
      'Content-Type: text/plain\r\n' +
      'Assoc-Req: /test/a\r\n' + 
      '\r\n' +
      'HTTP/1.1 200\r\n' +
      'Content-Type: text/plain\r\n' +
      'Assoc-Req: /test/b\r\n' + 
      '\r\n',
      "ascii",
      function () {
        c.write(
          'HTTP/1.1 200\r\n' +
          'Content-Type: text/plain\r\n' +
          'Assoc-Req: /test/c\r\n' + 
          '\r\n' +
          'HTTP/1.1 200\r\n' +
          'Content-Type: text/plain\r\n' +
          'Assoc-Req: /test/d\r\n' + 
          'Content-Length: 4\r\n' +
          '\r\n' +
          'abcd'
        );
      }
    );
    c.end();    
  });

  c.addListener('data', function(chunk) {
    buf += chunk;
  });

  c.addListener('end', function() {
    c.end();
    check_requests(buf);
  });
  
  // TODO: ping server to adjust timeout for latency
  setTimeout(5000, check_requests, buf); 
});

srv.listen(server_port, '');


// check incoming requests for an untampered pipeline
function check_requests (buf) {
//  output = parse_messages('request', buf)

// TODO: check number / ordering of requests
// TODO: check for request modification
  
}

