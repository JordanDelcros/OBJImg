node-optipng
============

[![NPM version](https://badge.fury.io/js/optipng.svg)](http://badge.fury.io/js/optipng)
[![Build Status](https://travis-ci.org/papandreou/node-optipng.svg?branch=master)](https://travis-ci.org/papandreou/node-optipng)
[![Coverage Status](https://coveralls.io/repos/papandreou/node-optipng/badge.svg)](https://coveralls.io/r/papandreou/node-optipng)
[![Dependency Status](https://david-dm.org/papandreou/node-optipng.svg)](https://david-dm.org/papandreou/node-optipng)

The optipng command line utility as a readable/writable stream. This
is handy for situations where you don't want to worry about writing
the input to disc and reading the output afterwards.

If you don't have an `optipng` binary in your PATH, `node-optipng`
will try to use one of the binaries provided by <a
href="https://github.com/yeoman/node-optipng-bin">the node-optipng-bin
package</a>.

The constructor optionally takes an array of command line options for
the `optipng` binary:

```javascript
var OptiPng = require('optipng'),
    myOptimizer = new OptiPng(['-o7']);

sourceStream.pipe(myOptimizer).pipe(destinationStream);
```

OptiPng as a web service:

```javascript
var OptiPng = require('optipng'),
    http = require('http');

http.createServer(function (req, res) {
    if (req.headers['content-type'] === 'image/png') {
        res.writeHead(200, {'Content-Type': 'image/png'});
        req.pipe(new OptiPng(['-o7'])).pipe(res);
    } else {
        res.writeHead(400);
        res.end('Feed me a PNG!');
    }
}).listen(1337);
```

Installation
------------

Make sure you have node.js and npm installed, then run:

    npm install optipng

License
-------

3-clause BSD license -- see the `LICENSE` file for details.
