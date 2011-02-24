
# HTTP Pipeline Surveyor


## Installation

First you'll need [Node](http://nodejs.org/) and its package manager, 
[npm](http://npmjs.org/).

Then, it can be installed with npm like this:

  > npm install htracr


## Use

Just call it on the command line;

  > pipeline-surveyor

and it will report back "OK" if it thinks HTTP pipelining is usable on your
current connection. If not, it will say "FAIL", followed by a description
of the problem it encountered.

## Running the server

The server-side can be run using node. 

## Contact

Mark Nottingham <mnot@mnot.net>

http://github.com/mnot/htracr/