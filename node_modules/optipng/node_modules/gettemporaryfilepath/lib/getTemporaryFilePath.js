// Fragments of the seemingly abandoned https://github.com/bruce/node-temp/blob/master/lib/temp.js patched to use os.tmpDir() if available:

var Path = require('path'),
    fs = require('fs'),
    os;

try {
    os = require('os');
} catch (e) {}

// Memoized because those fs.realpathSync calls are expensive:
var tempDir;
function getTempDir() {
    if (!tempDir) {
        if (os && os.tmpDir) {
            tempDir = os.tmpDir();
        } else {
            var environmentVariableNames = ['TMPDIR', 'TMP', 'TEMP'];
            for (var i = 0 ; i < environmentVariableNames.length ; i += 1) {
                var environmentVariableValue = process.env[environmentVariableNames[i]];
                if (environmentVariableValue) {
                    tempDir = fs.realpathSync(environmentVariableValue);
                    break;
                }
            }
            if (!tempDir) {
                if (process.platform === 'win32') {
                    tempDir = fs.realpathSync('c:\\tmp');
                } else {
                    tempDir = fs.realpathSync('/tmp');
                }
            }
        }
    }
    return tempDir;
}

function parseAffixes(rawAffixes, defaultPrefix) {
    var affixes = {prefix: null, suffix: null};
    if (rawAffixes) {
        switch (typeof rawAffixes) {
        case 'string':
            affixes.prefix = rawAffixes;
            break;
        case 'object':
            affixes = rawAffixes;
            break;
        default:
            throw new Error("Unknown affix declaration: " + affixes);
        }
    } else {
        affixes.prefix = defaultPrefix;
    }
    return affixes;
}

function getTemporaryFilePath(rawAffixes, defaultPrefix) {
    var affixes = parseAffixes(rawAffixes, defaultPrefix),
        now = new Date(),
        name = [
            affixes.prefix,
            now.getYear(), now.getMonth(), now.getDay(),
            '-',
            process.pid,
            '-',
            (Math.random() * 0x100000000 + 1).toString(36),
            affixes.suffix
        ].join('');
    return Path.join(getTempDir(), name);
}

module.exports = getTemporaryFilePath;
