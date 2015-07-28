var assert = require("assert")
var exec = require('child_process').exec
var pbclient = require('libprofitbricks')

var dcid = '';
var dcid2 = '';

describe('Datacenter tests', function () {
    // Long timeout needed since mocha fails test if done() is not called in 2 seconds
    this.timeout(40000);

    it('List Datacenters', function (done) {
        dataCenterGet(done)
    })

    it('Create a Datacenter from script', function (done) {
        dataCenterCreateScript(done)
    })

    it('Get a specific Datacenter', function (done) {
        dataCenterShow(done)
    })

    it('Create a Datacenter from parameters', function (done) {
        dataCenterCreateParams(done)
    })

    it('Updates a Datacenter', function (done) {
        dataCenterUpdate(done)
    })

    it('Deletes a Datacenter', function (done) {
        dataCenterDelete(done)
    })

    after(function(done) {
        pbclient.deleteDatacenter(dcid2, function(error, response, body) {
            assert.equal(error, null);
            done()
        })
    })
})

function dataCenterGet(done) {
    exec('node profitbricks.js datacenter list --json', function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length >= 0, true)
        done()
    })
}

function dataCenterShow(done) {
    exec('node profitbricks.js datacenter show -i ' + dcid + ' --json', function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        assert.equal(data[0].Id, dcid)
        assert.equal(data[0].Name, "PB_CLI Test Datacenter")
        assert.equal(data[0].Location, "us/lasdev")
        done()
    })
}

function dataCenterCreateScript(done) {
    var script = './scripts/datacenter.json'
    exec('node profitbricks.js datacenter create -p ' + script + ' --json', function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data[0].Name, "PB_CLI Test Datacenter")
        assert.equal(data[0].Location, "us/lasdev")
        dcid = data[0].Id
        done()
    })
}

function dataCenterCreateParams(done) {
    var name = "1Datacenter"
    var description = "description"
    var location = "de/fkb"
    exec('node profitbricks.js datacenter create --json --name ' + name +
    ' --description ' + description +
    ' --location ' + location, function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        if (data.length) {
            assert.notEqual(data[0].Id, null)
            dcid2 = data[0].Id
            assert.equal(data[0].Name, name)
            assert.equal(data[0].Location, location)
            exec('node profitbricks.js datacenter delete -i ' + data[0].Id+ ' --json --force', function (error, stdout, stderr) {
                checkErrors(error, stderr, done)
                assert.equal(stdout, '')
                done()
            })
        }
    })
}

function dataCenterUpdate(done) {
    var name = "datacenter1"
    var description = "description"
    exec('node profitbricks.js datacenter update --json ' +
    '--name ' + name +
    ' --description ' + description +
    ' -i ' + dcid, function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        if (data.length) {
            assert.equal(data[0].Id, dcid)
            assert.equal(data[0].Name, name)
            done()
        }
    })
}

function dataCenterDelete(done) {
    exec('node profitbricks.js datacenter delete -i ' + dcid + ' --json --force', function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        assert.equal(stdout, '')
        setTimeout(function(){
            exec('node profitbricks.js datacenter show -i ' + dcid + ' --json', function (error, stdout, stderr) {
                assert.equal(stdout, "")
                done()
            })
        }, 10000)
    })
}

function checkErrors(error, stderr, done) {
    /*console.log("error: " + error)
     console.log("stderr: " + stderr)*/
    if (error || stderr) {
        throw {description: stderr, stack: error}
    }
}
