var assert = require("assert")
var exec = require('child_process').exec
var pbclient = require('libprofitbricks')
var helpers = require('../helpers')

var dcid = '';
var volumeid = '';
var loadbalancerid = '';

describe('Loadbalancer tests', function () {
        // Long timeout needed since mocha fails test if done() is not called in 2 seconds
        this.timeout(60000);

        before('Sets up Loadbalancer tests', function (done) {
            pbclient.pbauth(helpers.getAuthData())

            var data = {
                properties: {
                    name: "PB_CLI Test Datacenter - Loadbalancer",
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
                        var volumeData = {
                            "properties": {
                                "size": "1",
                                "bus": "IDE",
                                "licenceType": "LINUX"
                            }
                        }
                        pbclient.createVolume(dcid, volumeData, function(error, response, body){
                            var volume = JSON.parse(body)
                            volumeid = volume.id
                            done()
                        })
                    })
                }
            })
        })

        it('Creates a Loadblancer script', function (done) {
            setTimeout(function() {
                loadbalancerCreateScript(done)
            }, 30000)
        })

        it('Creates a Loadblancer params', function (done) {
            setTimeout(function() {
                loadbalancerCreateParams(done)
            }, 30000)
        })

        it('List Loadbalancers', function (done) {
            loadbalancerGet(done)
        })

        it('Shows a Loadbalancer', function (done) {
            loadbalancerShow(done)
        })

        it('Updates a Loadbalancer', function (done) {
            loadbalancerUpdate(done)
        })

        it('Deletes a Loadbalancer', function (done) {
            loadbalancerDelete(done)
        })

        after(function(done) {
            pbclient.deleteDatacenter(dcid, function(error, response, body) {
                assert.equal(error, null);
                done()
            })
        })
})

function loadbalancerGet(done) {
    exec('node profitbricks.js loadbalancer list --json ' +
    ' --datacenterid ' + dcid, function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        done()
    })
}

function loadbalancerCreateParams(done) {
    var name = "PB_CLI_Test_Loadbalancer"
    var ip = "127.0.0.0"
    var dhcp = "true"
    exec('node profitbricks.js loadbalancer create --json' +
    ' --datacenterid ' + dcid +
    ' --name  ' + name +
    ' --ip ' + ip +
    ' --dhcp ' + dhcp, function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var info = JSON.parse(stdout);
        assert(info.length > 0, true)
        done()
    })
}

function loadbalancerCreateScript(done) {
    var script = './scripts/loadbalancer.json'
    exec('node profitbricks.js loadbalancer create --json' +
    ' --datacenterid ' + dcid +
    ' -p ' + script, function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var info = JSON.parse(stdout);
        assert(info.length > 0, true)
        loadbalancerid = info[0].Id
        done()
    })
}


function loadbalancerShow(done) {
    exec('node profitbricks.js loadbalancer show --json' +
        ' --datacenterid ' + dcid +
        ' -i ' + loadbalancerid, function (error, stdout, stderr) {
            checkErrors(error, stderr, done)
            var data = JSON.parse(stdout)
            assert(data.length > 0, true)
            assert(data[0].Id, loadbalancerid)
            done()
        }
    )
}

function loadbalancerUpdate(done) {
    var name = "PB_CLI_Test_Loadbalancer_UPDATED"
    exec('node profitbricks.js loadbalancer update --json' +
    ' -i ' + loadbalancerid +
    ' --datacenterid ' + dcid +
    ' --name ' + name, function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        assert.equal(data[0].Name, name)
        done()
    })
}

function loadbalancerDelete(done) {
    exec('node profitbricks.js loadbalancer delete' +
    ' --datacenterid ' + dcid +
    ' -i ' + loadbalancerid +
    ' --force ', function (error, stdout, stderr) {
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
