#!/usr/bin/env node

var net = require('net');
var parse_messages = require('pipeline-surveyor').parse_messages;

// config
var server_host = 'mnot.no.de'
var server_port = '80'


var c = net.createConnection(server_port, server_host);
var buf = "";
c.setEncoding('ascii');
c.setNoDelay(true);

// TODO: do we need to check 100 status codes?

c.addListener('connect', function() {
  // send four requests over two subsequent packets.
  c.write(
    "GET /a HTTP/1.1\r\n" +
    "Host: " + server_host + ":" + server_port + "\r\n\r\n" +
    "GET /b HTTP/1.1\r\n" +
    "Host: " + server_host + ":" + server_port + "\r\n\r\n",
    'ascii',
    function () {
      c.write(
        "GET /c HTTP/1.1\r\n" +
        "Host: " + server_host + ":" + server_port + "\r\n\r\n" +
        "GET /d HTTP/1.1\r\n" +
        "Host: " + server_host + ":" + server_port + "\r\n\r\n"
      );        
    }
  );
  // TODO: ping server to adjust for latency
  c.setTimeout(5000, check_responses);
});


c.addListener('data', function(chunk) {
  buf += chunk;
});

// Characteristics of the responses that we expect to see, in order.
expected_responses = [
  {
    headers: {
      'assoc-req': '/a'
    }
  },
  {
    headers: {
      'assoc-req': '/b'
    }
  },
  {
    headers: {
      'assoc-req': '/c'
    }
  },
  {
    headers: {
      'assoc-req': '/d'
    },
    body: "abcd"
  },
];


function check_responses () {
  c.end();
  
  output = parse_messages('response', buf)

  // check for missing responses
  if (output.length < expected_responses.length) {
    fail('Not all responses received. Expecting ' + 
         expected_responses.length + ', got ' + output.length + '.');
  }

  var i = 0;
  output.forEach(function (res) {

    // check for unexpected responses.
    var expected_res = expected_responses[i]
    if (! expected_res) {
      fail('Extra response found.')
    }

    // Check HTTP version
    if (res.versionMajor !== 1 || res.versionMinor !== 1) {
      fail('Unsupported HTTP version (' + 
      res.versionMajor + '.' + res.versionMinor + ')')
    }

    // check responses status code
    if (res.statusCode != "200") {
      fail('Status code mangled');
    }

    // check response headers
    for (hdr_name in expected_res.headers) {
      if (! res.headers[hdr_name]) {
        fail("Expected header " + hdr_name + " not found.");
      }
      hdr_value = expected_res.headers[hdr_name];
      if (res.headers[hdr_name].trim() != hdr_value) {
        fail("Unexpected value for " + hdr_name + " header; " + 
          res.headers[hdr_name]);
      }
    }

    // check response body
    if (expected_res.body) {
      if (expected_res.body !== res.body) {
        fail ("Mismatched bodies.");
      }
    }

    i += 1;
  })

  console.log("OK")
  process.exit(0);
}

// It's not working out. It's not you, it's me; I don't like you.
function fail (why) {
  console.log("FAIL");
  console.log(why);
  process.exit(1);
}

c.addListener('end', check_responses);
