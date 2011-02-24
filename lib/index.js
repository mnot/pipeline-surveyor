
var Buffer = require('buffer').Buffer;
var HTTPParser = process.binding('http_parser').HTTPParser;

// given a parser type ('request' or 'response') and a string,
// return an array of the HTTP messages that it contains.
function parse_messages (parser_type, str) {
  var parser = new HTTPParser(parser_type);
  var buffer = new Buffer(str, 'utf-8');
  var output = [];

  parser.onMessageBegin = function() {
    output.push({
      versionMajor: undefined,
      versionMinor: undefined,
      method: undefined,
      uri: undefined,
      statusCode: undefined,
      headers: {},
      body: "",
      complete: false
    });
    parser.field = null;
    parser.value = null;
  };

  parser.onURL = function(b, start, len) {
    var slice = b.toString('ascii', start, start + len);
    if (output[output.length-1].url) {
      output[output.length-1].url += slice;
    } else {
      // Almost always will branch here.
      output[output.length-1].url = slice;
    }
  };
  
  parser.onHeaderField = function(b, start, len) {
    var slice = b.toString('ascii', start, start + len).toLowerCase();
    if (parser.value != undefined) {
      // note that this overwrites dup headers
      output[output.length-1].headers[parser.field] = parser.value;
      parser.field = null;
      parser.value = null;
    }
    if (parser.field) {
      parser.field += slice;
    } else {
      parser.field = slice;
    }
  };

  parser.onHeaderValue = function(b, start, len) {
    var slice = b.toString('ascii', start, start + len);
    if (parser.value) {
      parser.value += slice;
    } else {
      parser.value = slice;
    }
  };

  parser.onHeadersComplete = function(info) {
    if (parser.field && (parser.value != undefined)) {
      output[output.length-1].headers[parser.field] = parser.value;
      parser.field = null;
      parser.value = null;
    }

    output[output.length-1].versionMajor = info.versionMajor;
    output[output.length-1].versionMinor = info.versionMinor;
    output[output.length-1].statusCode = info.statusCode;
    output[output.length-1].method = info.method;

    return false // isHeadResponse;
  };

  parser.onBody = function(b, start, len) {
    var slice = b.slice(start, start + len);
    output[output.length-1].body += slice;
  };

  parser.onMessageComplete = function() {
    output[output.length-1].complete = true;
    if (parser.field && (parser.value != undefined)) {
      output[output.length-1].headers[parser.field] = parser.value;
    }  
  }
  
  parser.execute(buffer, 0, buffer.length);
  
  // filter out incomplete responses.
  var complete_output = [];
  output.forEach(function (o) {
    if (o.complete) {
      complete_output.push(o);
    }
  })
  return complete_output;
};  


exports.parse_messages = parse_messages;
