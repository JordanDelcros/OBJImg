node-gettemporaryfilepath
=========================

Generate file names for temporary files:

```javascript
var getTemporaryFilePath = require('gettemporaryfilepath');

getTemporaryFilePath(); // "/tmp/112116-2662-18u8bl8"
getTemporaryFilePath(); // "/tmp/112116-2662-1inp07r"
```

Creating and cleaning up the temporary files is your own
responsibility.

Custom suffixes and prefixes are supported using the same syntax as <a
href="https://github.com/bruce/node-temp#affixes">node-temp</a> (from
which most of the code was taken):

```javascript
getTemporaryFilePath({suffix: '.png'}); // "/tmp/112116-2662-125a83d.png"
getTemporaryFilePath({prefix: 'foo-'}); // "/tmp/foo-112116-2662-avhu28"
```

Installation
------------

Make sure you have node.js and npm installed, then run:

    npm install gettemporaryfilepath


License
-------

Based on <a href="https://github.com/bruce/node-temp#affixes">node-temp</a>
and licensed under the 3-clause BSD license -- see the `LICENSE` file for
details.
