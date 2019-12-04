var assert = require("assert")
var exec = require('child_process').exec
var pbclient = require('libionosenterprise')
var helpers = require('../helpers')

var dcid = '';
var sid = '';
var vid = '';

describe('Volume tests', function () {
    // Long timeout needed since mocha fails test if done() is not called in 2 seconds
    this.timeout(60000);

    before(function(done) {
        pbclient.pbauth(helpers.getAuthData())
        var data = {
            properties: {
                name: "PB_CLI Test Datacenter - Volumes",
                location: "us/las",
                description: "Test datacenter for PB_CLI"
            }
        }

        pbclient.createDatacenter(data, function(error, response, body) {
            if (body) {
                var dc = JSON.parse(body)
                dcid = dc.id
                var serverData = {
                    properties: {
                        name: "PB_CLI Test Server",
                        cores: 1,
                        ram: 1024
                    }
                }
                pbclient.createServer(dcid, serverData, function(error, response, body) {
                    assert.equal(error, null);
                    var server = JSON.parse(body)
                    sid = server.id
                    done()
                })
            }
        })
    })

    it('Create a Volume from script', function (done) {
        volumeCreateScript(done)
    })

    it('Create a Volume from parameters', function (done) {
        volumeCreateParams(done)
    })

	it('List Volumes', function (done) {
        setTimeout(function(){
            volumeGet(done)
        }, 30000)
    })

    it('Get specific Volume', function (done) {
        volumeShow(done)
    })

    it('Attaches a Volume to a Server', function (done) {
        attachVolume(done)
    })

    it('Detaches a Volume from a Server', function (done) {
        setTimeout(function(){
            detachVolume(done)
        }, 20000)
    })

    it('Updates a Volume', function (done) {
        volumeUpdate(done)
    })

    it('Deletes a Volume', function (done) {
        volumeDelete(done)
    })

    after(function(done) {
        pbclient.deleteDatacenter(dcid, function(error, response, body) {
            assert.equal(error, null);
            done()
        })
    })
})

function volumeGet(done) {
    exec('node ionosenterprise.js volume list --datacenterid ' + dcid + ' --json', function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        done()
    })
}

function volumeCreateScript(done) {
    var script = './scripts/volume.json'
    exec('node ionosenterprise.js volume create --datacenterid ' + dcid + ' -p ' + script + ' --json', function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        vid = data[0].Id
        done()
    })
}

function volumeShow(done) {
    exec('node ionosenterprise.js volume show ' +
    ' --datacenterid ' + dcid +
    ' -i ' + vid +
    ' --json', function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var info = JSON.parse(stdout);
        assert.equal(info.length > 0, true)
        assert.equal(info[0].Id, vid)
        done()
    })
}

function volumeCreateParams(done) {
    var size = "1"
    var bus = "VIRTIO"
    var licence = "LINUX"
    var type = "HDD"
    exec('node ionosenterprise.js volume create --json ' +
    ' --datacenterid  ' + dcid +
    ' --size ' + size +
    ' --licencetype ' + licence +
    ' --type ' + type +
    ' --bus ' + bus, function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        if (data.length) {
            vid = data[0].Id
            assert.equal(data[0].Size, size + 'GB')
            assert.equal(data[0].Bus, bus)
            done()
        }
    })
}

function attachVolume(done) {
    exec('node ionosenterprise.js volume attach --json ' +
    '--datacenterid ' + dcid +
    ' --serverid ' + sid +
    ' -i ' + vid    , function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        done()
    })
}

function detachVolume(done) {
    exec('node ionosenterprise.js volume detach --json ' +
    '--datacenterid ' + dcid +
    ' --serverid ' + sid +
    ' -i ' + vid , function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        done()
    })
}

function volumeUpdate(done) {
    var name = "PB_CLI_Test_Volume_UPDATED"
    exec('node ionosenterprise.js volume update --json ' +
    '-i ' + vid +
    ' --datacenterid ' + dcid +
    ' --name ' + name, function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        if (data.length) {
            assert.equal(data[0].Name, name)
            done()
        }
    })
}

function volumeDelete(done) {
    exec('node ionosenterprise.js volume delete ' +
    '--datacenterid ' + dcid +
    ' -i ' + vid +
    ' --json --force', function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        done()
    })
}

function checkErrors(error, stderr, done) {
    /*console.log("error: " + error)
     console.log("stderr: " + stderr)*/
    if (error || stderr) {
        throw {description: stderr, stack: error}
    }
}
