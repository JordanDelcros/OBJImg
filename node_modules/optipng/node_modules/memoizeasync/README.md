node-memoizeasync
=================

Yet another memoizer for asynchronous functions.

```javascript
function myExpensiveComputation(arg1, arg2, cb) {
   // ...
   cb(null, result);
}

var memoized = memoizeAsync(myExpensiveComputation);
```

Now `memoized` works exactly like myExpensiveComputation, except that
the actual computation is only performed once for each unique set of
arguments (apart from the callback):

```javascript
memoized(42, 100, function (err, result) {
    // Got the result!

    memoized(42, 100, function (err, result) {
        // Got the same result, and much faster this time!
    });
});
```

The function returned by `memoizeAsync` invokes the wrapped function
in the context it's called in itself, so `memoizeAsync` even works for
memoizing a method that has access to instance variables:

```javascript
function Foo(name) {
    this.name = name;
}

Foo.prototype.myMethod = memoizeAsync(function (arg1, arg2, cb) {
    console.warn("Cool, this.name works here!", this.name);
    // ...
    cb(null, "That was tough, but I'm done now!");
});
```

To distinguish different invocations (whose results need to be cached
separately) `memoizeAsync` relies on a naive stringification of the
arguments, which is looked up in an internally kept hash. If the
function you're memoizing takes non-primitive arguments you might want
to provide a custom `argumentsStringifier` as the second argument to
`memoizeAsync`. Otherwise all object arguments will be considered equal
because they stringify to `[object Object]`:

```javascript
var memoized = memoizeAsync(function functionToMemoize(obj, cb) {
    // ...
    cb(null, Object.keys(obj).join(''));
}, function argumentStringifier(args) {
   return args.map(function (arg) {return JSON.stringify(arg);}).join(",");
});

memoized({foo: 'bar'}, function (err, result) {
    // result === 'foo'
    memoized({quux: 'baz'}), function (err, result) {
        // result === 'quux'
    });
});
```

Had the custom `argumentsStringifier` not been provided, `result`
would have been `foo` both times.

Check out <a
href="https://github.com/papandreou/node-memoizeasync/blob/master/test/memoizeAsync.js">the
custom argumentsStringifier test</a> for another example.


Installation
------------

Make sure you have node.js and npm installed, then run:

    npm install memoizeasync

License
-------

3-clause BSD license -- see the `LICENSE` file for details.
