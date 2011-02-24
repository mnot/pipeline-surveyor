
# HTTP Pipeline Surveyor

HTTP pipelining brings attractive performance improvements, but it can be 
a dangerous business on the open Internet.

This script demonstrates one method of checking an HTTP connection to see
if pipelining is safe on a given connection. It is ONLY intended to discover
problems with errant intermediaries (e.g., "transparent" proxies); it doesn't
assure that the servers you contact will correctly support pipelining.

It's a work in progress. For more information, see the associated
[Internet-Draft](https://github.com/HTTPlus/draft-nottingham-http-pipeline).


## Installation

First you'll need [Node](http://nodejs.org/) and its package manager, 
[npm](http://npmjs.org/).

Then, it can be installed with npm like this:

  > npm install pipeline-surveyor


## Use

Just call it on the command line;

  > pipeline-surveyor

and it will report back "OK" if it thinks HTTP pipelining is usable on your
current connection. If not, it will say "FAIL", followed by a description
of the problem it encountered.

## Running the server

The server-side can be run using node.You'll still need to have the npm
package installed.

## Contact

Mark Nottingham <mnot@mnot.net>

https://github.com/mnot/pipeline-surveyor