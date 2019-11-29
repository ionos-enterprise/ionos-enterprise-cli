var assert = require("assert")
var exec = require('child_process').exec
var pbclient = require('libionosenterprise')

var dcid = ''
var sid = ''
var nicid = ''
var ipblockid = ''

describe('IP Block tests', function () {
        // Long timeout needed since mocha fails test if done() is not called in 2 seconds
        this.timeout(20000);

        it('Reserve an IP Block params', function (done) {
            ipblockCreateParams(done)
        })

        it('Gets IP Blocks', function (done) {
            ipblockGet(done)
        })

        it('Shows IP Block', function (done) {
            ipblockShow(done)
        })

        it('Release an IP Block', function (done) {
            ipblockDelete(done)
        })
    }
)

function ipblockGet(done) {
    exec('node ionosenterprise.js ipblock list --json', function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        assert.equal(data[0].IPs.length, 1)
        done()
    })
}

function ipblockCreateParams(done) {
    var location = "us/las"
    var size = 1

    exec('node ionosenterprise.js ipblock create' +
    ' --location ' + location +
    ' --size ' + size +
    ' --json', function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        ipblockid = data[0].Id
        done()
    })
}

function ipblockShow(done) {
    exec('node ionosenterprise.js ipblock show --json ' +
    ' -i ' + ipblockid, function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        assert.equal(data[0].Id, ipblockid)
        done()
    })
}

function ipblockDelete(done) {
    exec('node ionosenterprise.js ipblock delete --force ' +
    ' -i ' + ipblockid, function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        assert.ok(stdout)
        exec('node ionosenterprise.js ipblock show --json ' +
        ' -i ' + ipblockid, function (error, stdout, stderr) {
            assert.equal(stdout, "")
            assert.notEqual(stderr, null)
            done()
        })
    })
}

function checkErrors(error, stderr, done) {
    /*console.log("error: " + error)
     console.log("stderr: " + stderr)*/
    if (error || stderr) {
        throw {description: stderr, stack: error}
    }
}
