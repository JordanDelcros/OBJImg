var memoizeAsync = require('../lib/memoizeAsync'),
    expect = require('expect.js');

describe('memoizeAsync', function () {
    it('on a zero-param function should keep returning the same result', function (done) {
        var nextNumber = 1,
            memoizedGetNextNumber = memoizeAsync(function getNextNumber(cb) {
                process.nextTick(function () {
                    cb(null, nextNumber++);
                });
            });

        memoizedGetNextNumber(function (err, nextNumber) {
            expect(nextNumber).to.equal(1);
            memoizedGetNextNumber(function (err, nextNextNumber) {
                expect(nextNextNumber).to.equal(1);
                done();
            });
        });
    });

    it('on a multi-param function should only return the same result when the parameters are the same', function (done) {
        var nextNumber = 1,
            memoizedSumOfOperandsPlusNextNumber = memoizeAsync(function sumOfOperandsPlusNextNumber(op1, op2, cb) {
                process.nextTick(function () {
                    cb(null, op1 + op2 + nextNumber++);
                });
            });

        memoizedSumOfOperandsPlusNextNumber(10, 10, function (err, sumPlusNextNumber) {
            expect(sumPlusNextNumber).to.equal(21);
            memoizedSumOfOperandsPlusNextNumber(10, 10, function (err, sumPlusNextNextNumber) {
                expect(sumPlusNextNextNumber).to.equal(21);
                memoizedSumOfOperandsPlusNextNumber(10, 20, function (err, sumPlusNextNextNextNumber) {
                    expect(sumPlusNextNextNextNumber).to.equal(32);
                    memoizedSumOfOperandsPlusNextNumber.purge(10, 20);
                    memoizedSumOfOperandsPlusNextNumber(10, 20, function (err, number) {
                        expect(number).to.equal(33);
                        memoizedSumOfOperandsPlusNextNumber(10, 10, function (err, number) {
                            expect(number).to.equal(21);
                            memoizedSumOfOperandsPlusNextNumber.purgeAll();
                            memoizedSumOfOperandsPlusNextNumber(10, 20, function (err, number) {
                                expect(number).to.equal(34);
                                memoizedSumOfOperandsPlusNextNumber(10, 10, function (err, number) {
                                    expect(number).to.equal(25);
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it('should produce a function that works as a method', function (done) {
        function Counter() {
            this.nextNumber = 1;
        }

        Counter.prototype.getNextNumber = function (cb) {
            var that = this;
            process.nextTick(function () {
                cb(null, that.nextNumber++);
            });
        };

        var counter = new Counter();

        counter.getNextNumber(function (err, nextNumber) {
            expect(nextNumber).to.equal(1);
            expect(counter.nextNumber).to.equal(2);
            counter.getNextNumber(function (err, nextNextNumber) {
                expect(nextNextNumber).to.equal(2);
                expect(counter.nextNumber).to.equal(3);
                done();
            });
        });
    });

    it('should deliver the same result to multiple callbacks that are queued before the result is available', function (done) {
        var nextNumber = 1,
            memoizedGetNextNumber = memoizeAsync(function getNextNumber(cb) {
                process.nextTick(function () {
                    cb(null, nextNumber++);
                });
            });

        var results = [];
        function receiveResultAndProceedIfReady(err, number) {
            results.push(number);
            if (results.length === 2) {
                expect(results[0]).to.equal(1);
                expect(results[1]).to.equal(1);
                done();
            }
        }
        memoizedGetNextNumber(receiveResultAndProceedIfReady);
        memoizedGetNextNumber(receiveResultAndProceedIfReady);
    });

    it('should work with a custom argumentsStringifier', function (done) {
        function toCanonicalJson(obj) {
            return JSON.stringify(function traverseAndSortKeys(obj) {
                if (Array.isArray(obj)) {
                    return obj.map(traverseAndSortKeys);
                } else if (typeof obj === 'object' && obj !== null) {
                    var resultObj = {};
                    Object.keys(obj).sort().forEach(function (key) {
                        resultObj[key] = traverseAndSortKeys(obj[key]);
                    });
                    return resultObj;
                } else {
                    return obj;
                }
            }(obj));
        }

        var nextNumber = 1,
            memoizedGetNextNumber = memoizeAsync(function getNextNumber(obj, cb) {
                process.nextTick(function () {
                    cb(null, nextNumber++);
                });
            }, function (args) {
                return args.map(toCanonicalJson).join('\x1d');
            });

        memoizedGetNextNumber({foo: 'bar', quux: 'baz'}, function (err, nextNumber) {
            expect(nextNumber).to.equal(1);
            memoizedGetNextNumber({quux: 'baz', foo: 'bar'}, function (err, nextNumber) {
                expect(nextNumber).to.equal(1);
                memoizedGetNextNumber({barf: 'baz'}, function (err, nextNumber) {
                    expect(nextNumber).to.equal(2);
                    done();
                });
            });
        });
    });
});
