var assert = require("assert")
var exec = require('child_process').exec
var pbclient = require('libionosenterprise')
var helpers = require('../helpers')

var dcid = ''
var sid = ''
var nicid = ''

describe('Nic tests', function() {
    // Long timeout needed since mocha fails test if done() is not called in 2 seconds
    this.timeout(40000);

    before(function(done) {
        pbclient.pbauth(helpers.getAuthData())
        var data = {
            properties: {
                name: "PB_CLI Test Datacenter - NIC",
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
                    if (body) {
                        var server = JSON.parse(body)
                        sid = server.id
                    }
                    done()
                })
            }
        })
    })

    it('Creates a Nic script', function(done) {
        setTimeout(function() {
            nicCreateScript(done)
        }, 10000)
    })

    it('Creates a Nic params', function(done) {
        nicCreateParams(done)
    })

    it('List Nics', function(done) {
        setTimeout(function() {
            nicGet(done)
        }, 30000)
    })

    it('Shows a Nic', function(done) {
        setTimeout(function() {
            nicShow(done)
        }, 3000)
    })

    it('Updates a Nic', function(done) {
        nicUpdate(done)
    })

    it('Deletes a Nic', function(done) {
        setTimeout(function() {
            nicDelete(done)
        }, 10000)
    })

    after(function(done) {
        pbclient.deleteDatacenter(dcid, function(error, response, body) {
            assert.equal(error, null);
            done()
        })
    })
})

function nicGet(done) {
    exec('node ionosenterprise.js nic list --datacenterid ' + dcid +
        ' --serverid ' + sid +
        ' --json',
        function(error, stdout, stderr) {
            checkErrors(error, stderr, done)
            var data = JSON.parse(stdout)
            assert.equal(data.length > 0, true)
            done()
        })
}

function nicCreateParams(done) {
    var name = 'PB_CLI_Test_NIC'
    var ips = '127.0.0.1'
    var dhcp = 'true'
    var lan = '1'
    exec('node ionosenterprise.js nic create' +
        ' --datacenterid ' + dcid +
        ' --serverid ' + sid +
        ' --name ' + name +
        ' --ip ' + ips +
        ' --dhcp ' + dhcp +
        ' --lan ' + lan +
        ' --json',
        function(error, stdout, stderr) {
            checkErrors(error, stderr, done)
            var data = JSON.parse(stdout)
            assert.equal(data.length > 0, true)
            done()
        })
}

function nicCreateScript(done) {
    var script = './scripts/nic.json'
    exec('node ionosenterprise.js nic create' +
        ' --datacenterid ' + dcid +
        ' --serverid ' + sid +
        ' -p ' + script +
        ' --json ',
        function(error, stdout, stderr) {
            checkErrors(error, stderr, done)
            var data = JSON.parse(stdout)
            assert.equal(data.length > 0, true)
            nicid = data[0].Id
            done()
        })
}

function nicShow(done) {
    exec('node ionosenterprise.js nic show --json' +
        ' --datacenterid ' + dcid +
        ' --serverid ' + sid +
        ' -i ' + nicid,
        function(error, stdout, stderr) {
            checkErrors(error, stderr, done)
            var data = JSON.parse(stdout)
            assert.equal(data.length > 0, true)
            assert.equal(data[0].Id, nicid)
            done()
        })
}

function nicUpdate(done) {
    exec('node ionosenterprise.js nic update --json ' +
        '--datacenterid ' + dcid +
        ' --serverid ' + sid +
        ' --name ' + 'newName' +
        ' --lan ' + 2 +
        ' -i ' + nicid,
        function(error, stdout, stderr) {
            checkErrors(error, stderr, done)
            var data = JSON.parse(stdout)
            assert.equal(data[0].Id, nicid)
            assert.equal(data[0].Name, 'newName')
            assert.equal(data[0].Lan, '2')
            done()
        })
}

function nicDelete(done) {
    exec('node ionosenterprise.js nic delete --force' +
        ' --datacenterid ' + dcid +
        ' --serverid ' + sid +
        ' -i ' + nicid,
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
