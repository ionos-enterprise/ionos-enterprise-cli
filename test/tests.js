var assert = require("assert")
var exec = require('child_process').exec
var pbclient = require('libprofitbricks')

var dcid = '';
var sid = '';
var vid = '';
var snapshotid = '';

var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

// First, you need to instantiate a Mocha instance.
var mocha = new Mocha;

// Then, you need to use the method "addFile" on the mocha
// object for each file.

// Here is an example:
fs.readdirSync('./test').filter(function (file) {
    // Only keep the .js files
    if (file != 'tests.js' /*&& file == 'ipblock.js'*/)
        return file.substr(-3) === '.js';

}).forEach(function (file) {
    // Use the method "addFile" to add the file to mocha
    mocha.addFile(
        path.join('./test', file)
    );
});

// Now, you can run the tests.
mocha.run(function (failures) {
    process.on('exit', function () {
        process.exit(failures);
    });
});

function checkErrors(error, stderr, done) {
    /*console.log("error: " + error)
     console.log("stderr: " + stderr)*/
    if (error || stderr) {
        throw {description: stderr, stack: error}
    }
}

