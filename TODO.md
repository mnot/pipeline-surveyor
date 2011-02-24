# TODO

- Increase request and response complexity, add bodies to do better discovery
- Adjust timeout based upon ping to the server
- Modify server side to return the correct URI based on actual requests, so
  that an intermediary that properly multiplexes pipelined requests to 
  separate connections (e.g., Squid) isn't labelled as problematic.
- Check requests on the server side as well
- Allow command-line override of server to check with
- Optionally allow failing response stream to be uploaded to server for 
  analysis
- Try expect/continue to see of 100 status codes are OK? (not strictly 
  pipelining-related)