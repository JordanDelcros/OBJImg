module.exports = function memoizeAsync(lambda, argumentsStringifier) {
    argumentsStringifier = argumentsStringifier || function (args) {
        return args.map(String).join('\x1d'); // Group separator
    };
    var waitingCallbacksByStringifiedArguments = {},
        resultCallbackParamsByStringifiedArguments = {};

    function memoizer() { // ...
        var that = this, // In case you want to create a memoized method
            args = Array.prototype.slice.call(arguments),
            cb = args.pop(),
            stringifiedArguments = String(argumentsStringifier(args)); // In case the function returns a non-string
        if (stringifiedArguments in resultCallbackParamsByStringifiedArguments) {
            var resultCallbackParams = resultCallbackParamsByStringifiedArguments[stringifiedArguments];
            process.nextTick(function () {
                cb.apply(that, resultCallbackParams);
            });
        } else if (waitingCallbacksByStringifiedArguments[stringifiedArguments]) {
            waitingCallbacksByStringifiedArguments[stringifiedArguments].push(cb);
        } else {
            waitingCallbacksByStringifiedArguments[stringifiedArguments] = [cb];
            lambda.apply(that, args.concat(function () { // ...
                var resultCallbackParams = arguments,
                    waitingCallbacks = waitingCallbacksByStringifiedArguments[stringifiedArguments];
                resultCallbackParamsByStringifiedArguments[stringifiedArguments] = resultCallbackParams;
                delete waitingCallbacksByStringifiedArguments[stringifiedArguments];
                // Wait another tick in case an ill-behaved lambda called its callback immediately:
                process.nextTick(function () {
                    waitingCallbacks.forEach(function (cb) {
                        cb.apply(that, resultCallbackParams);
                    });
                });
            }));
        }
    };

    // args is optional, purges all results if no arguments are given
    memoizer.purge = function () { // ...
        delete resultCallbackParamsByStringifiedArguments[argumentsStringifier(Array.prototype.slice.call(arguments))];
    };

    memoizer.purgeAll = function () {
        resultCallbackParamsByStringifiedArguments = {};
    };

    return memoizer;
};
