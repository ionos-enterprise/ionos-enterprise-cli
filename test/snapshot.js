var assert = require("assert")
var exec = require('child_process').exec
var pbclient = require('libionosenterprise')
var helpers = require('../helpers')

var dcid = '';
var volumeid = '';
var snapshotid = '';

describe('Snapshot tests', function() {
    // Long timeout needed since mocha fails test if done() is not called in 2 seconds
    this.timeout(60000);

    before(function(done) {
        pbclient.pbauth(helpers.getAuthData())
        var data = {
            properties: {
                name: "PB_CLI Test Datacenter - Snapshot",
                location: "us/las",
                description: "Test datacenter for PB_CLI"
            }
        }

        pbclient.createDatacenter(data, function(error, response, body) {
            assert.equal(error, null);
            if (body) {
                var dc = JSON.parse(body)
                dcid = dc.id

                var volumeData = {
                    properties: {
                        name: "PB_CLI Test Volume",
                        size: "1",
                        bus: "VIRTIO",
                        licenceType: "LINUX",
                        type: "HDD"
                    }
                }
                pbclient.createVolume(dcid, volumeData, function(error, response, body) {
                    assert.equal(error, null);
                    var volume = JSON.parse(body)
                    volumeid = volume.id
                    done()
                })
            }
        })
    })

    it('Create a Snapshot from parameters', function(done) {
        setTimeout(function() {
            snapshotCreateParams(done)
        }, 30000)
    })

    it('List Snapshots', function(done) {
        snapshotList(done)
    })

    it('Show Snapshot', function(done) {
        snapshotShow(done)
    })

    it('Updates a Snapshot', function(done) {
        snapshotUpdate(done)
    })

    it('Deletes a Snapshot', function(done) {
        snapshotDelete(done)
    })

    after(function(done) {
        setTimeout(function(){
            pbclient.deleteDatacenter(dcid, function(error, response, body) {
                assert.equal(error, null);
                done()
            })
        }, 40000)
    })
})

function snapshotList(done) {
    exec('node ionosenterprise.js snapshot list --json ', function(error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        done()
    })
}

function snapshotShow(done) {
    exec('node ionosenterprise.js snapshot show --json ' +
        '-i ' + snapshotid,
        function(error, stdout, stderr) {
            checkErrors(error, stderr, done)
            var info = JSON.parse(stdout)
            assert.equal(info[0].Id, snapshotid)
            assert.equal(info[0].Name, 'NodeJS SDK Test')
            assert.equal(info[0].State, 'BUSY')
            done()
        })
}

function snapshotCreateParams(done) {
    exec('node ionosenterprise.js snapshot create --json' +
        ' --datacenterid ' + dcid +
        ' --volumeid ' + volumeid +
        ' --name ' + '"NodeJS SDK Test"',
        function(error, stdout, stderr) {
            checkErrors(error, stderr, done)
            var info = JSON.parse(stdout);
            assert(info.length > 0, true)
            snapshotid = info[0].Id
            done()
        })
}

function snapshotUpdate(done) {
    var name = "Newname"
    exec('node ionosenterprise.js snapshot update --json ' +
        '-i ' + snapshotid +
        ' --name ' + name,
        function(error, stdout, stderr) {
            checkErrors(error, stderr, done)
            var data = JSON.parse(stdout)
            if (data.length) {
                assert.equal(data[0].Name, name)
                done()
            }
        })
}

function snapshotDelete(done) {
    exec('node ionosenterprise.js snapshot delete ' +
        '-i ' + snapshotid +
        ' --force ',
        function(error, stdout, stderr) {
            checkErrors(error, stderr, done)
            done()
        })
}

function checkErrors(error, stderr, done) {
    /*console.log("error: " + error)
     console.log("stderr: " + stderr)*/
    if (error || stderr) {
        throw {
            description: stderr,
            stack: error
        }
    }
}
