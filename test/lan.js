var assert = require("assert")
var exec = require('child_process').exec
var pbclient = require('libionosenterprise')
var helpers = require('../helpers')

var dcid = ''
var lanid = ''

describe('Lan tests', function () {
    // Long timeout needed since mocha fails test if done() is not called in 2 seconds
    this.timeout(20000);

    before('Sets up Loadbalancer tests', function (done) {
        pbclient.pbauth(helpers.getAuthData())
        var data = {
            properties: {
                name: "PB_CLI Test Datacenter - LAN",
                location: "us/las",
                description: "Test datacenter for PB_CLI"
            }
        }

        pbclient.createDatacenter(data, function(error, response, body) {
            assert.equal(error, null);
            if (body) {
                var dc = JSON.parse(body)
                dcid = dc.id
                done()
            }
        })
    })

    it('Create Lans params', function (done) {
        lanCreateParams(done)
    })

    it('Get Lans', function (done) {
        setTimeout(function(){
            lanGet(done)
        }, 10000)
    })

    it('Show specific Lan', function (done) {
        setTimeout(function () {
            lanShow(done)
        }, 5000)
    })

    it('Deletes a Lan', function (done) {
        lanDelete(done)
    })

    after(function(done) {
        pbclient.deleteDatacenter(dcid, function(error, response, body) {
            assert.equal(error, null);
            done()
        })
    })
})

function lanCreateParams(done) {
    var name = 'name'
    exec('node ionosenterprise.js lan create --json' +
    ' --datacenterid ' + dcid +
    ' --public ' + true +
    ' --name ' + name, function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        lanid = data[0].Id
        done()
    })
}

function lanGet(done) {
    exec('node ionosenterprise.js lan list --json --datacenterid ' + dcid, function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        done()
    })
}

function lanShow(done) {
    exec('node ionosenterprise.js lan show --json ' +
    ' --datacenterid ' + dcid +
    ' -i ' + lanid, function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        assert.equal(data[0].Id, lanid)
        done()
    })
}

function lanDelete(done) {
    exec('node ionosenterprise.js lan delete --force --datacenterid ' + dcid +
        ' -i ' + lanid, function (error, stdout, stderr) {
            checkErrors(error, stderr, done)
            done()
        }
    )
}

function checkErrors(error, stderr, done) {
    /*console.log("error: " + error)
     console.log("stderr: " + stderr)
     console.log("checking errors")*/
    if (error || stderr) {
        throw {description: stderr, stack: error}
    }
}
