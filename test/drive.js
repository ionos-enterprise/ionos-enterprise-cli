var assert = require("assert")
var exec = require('child_process').exec
var pbclient = require('libprofitbricks')
var helpers = require('../helpers')

var dcid = '';
var sid = '';
var driveid = '';
var newdriveid = '';

describe('Drive tests', function() {
    // Long timeout needed since mocha fails test if done() is not called in 2 seconds
    this.timeout(90000);

    before(function(done) {
        pbclient.pbauth(helpers.getAuthData())
        var data = {
            properties: {
                name: "PB_CLI Test Datacenter - Drive",
                location: "us/las",
                description: "Test drive for PB_CLI"
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
                    if (body) {
                        var server = JSON.parse(body)
                        sid = server.id

                        pbclient.listImages(function(error, response, body) {
                            if (body) {
                                var images = JSON.parse(body)
                                for (var i = 0; i < images.items.length; i++) {
                                    if (images.items[i].properties.imageType == 'CDROM' && images.items[i].properties.location == 'us/las') {
                                        driveid = images.items[i].id
                                        done()
                                        break
                                    }
                                }

                            }
                        })
                    }
                })
            }
        })
    })

    it('Attaches drive to server', function(done) {
        setTimeout(function() {
            attachDrive(done)
        }, 10000);
    })

    it('List drives on server', function(done) {
        setTimeout(function() {
            listDrives(done)
        }, 30000);
    })

    it('Show drive on server', function(done) {
        showDrive(done)
    })

    it('Detaches drive from server', function(done) {
        detachDrive(done)
    })

    after(function(done) {
        pbclient.deleteDatacenter(dcid, function(error, response, body) {
            assert.equal(error, null);
            done()
        })
    })
})

function attachDrive(done) {
    exec('node profitbricks.js drives attach --json --datacenterid ' + dcid + ' --serverid ' + sid + ' -i ' + driveid, function(error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var result = JSON.parse(stdout)
        newdriveid = result[0].Id
        done()
    })
}

function listDrives(done) {
    exec('node profitbricks.js drives list --json --datacenterid ' + dcid + ' --serverid ' + sid, function(error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var result = JSON.parse(stdout)
        assert.equal(result[0].Id, driveid)
        done()
    })
}

function showDrive(done) {
    exec('node profitbricks.js drives show --json --datacenterid ' + dcid + ' --serverid ' + sid  + ' -i ' + driveid, function(error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var result = JSON.parse(stdout)
        assert.equal(result[0].Id, driveid)
        done()
    })
}

function detachDrive(done) {
    exec('node profitbricks.js drives detach --datacenterid ' + dcid + ' --serverid ' + sid + ' -i ' + newdriveid, function(error, stdout, stderr) {
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