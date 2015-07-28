var assert = require("assert")
var exec = require('child_process').exec
var pbclient = require('libprofitbricks')
var helpers = require('../helpers')

var dcid = '';
var sid = '';

describe('Server tests', function() {
    // Long timeout needed since mocha fails test if done() is not called in 2 seconds
    this.timeout(40000);

    before(function (done) {
        pbclient.pbauth(helpers.getAuthData())
        var data = {
            properties: {
                name: "PB_CLI Test Datacenter - Server",
                location: "us/lasdev",
                description: "Test datacenter for PV_CLI"
            }
        }
        pbclient.createDatacenter(data, function(error, response, body) {
            if (body) {
                var dc = JSON.parse(body)
                dcid = dc.id

                done()
            }
        })
    })

    it('Create a Server from script', function(done) {
        serverCreateScript(done)
    })

    it('List Servers', function(done) {
        setTimeout(function(){
            serverGet(done)
        }, 20000)
    })

    it('Get specific Server', function(done) {
        serverShow(done)
    })

    it('Stop/Start server', function(done){
        startStopServer(done)
    })

    it('Reboot server', function(done){
        rebootServer(done)
    })

    it('Create a Server from parameters', function(done) {
        serverCreateParams(done)
    })

    it('Updates a Server', function(done) {
        serverUpdate(done)
    })

    it('Deletes a Server', function(done) {
        serverDelete(done)
    })

    after(function(done) {
        pbclient.deleteDatacenter(dcid, function(error, response, body) {
            assert.equal(error, null);
            done()
        })
    })
})

function serverGet(done) {
    exec('node profitbricks.js server list --datacenterid ' + dcid + ' --json', function(error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        done()
    })
}

function startStopServer(done){
    exec('node profitbricks.js server stop --datacenterid ' + dcid + ' -i ' + sid + ' --json', function(error, stdout, stderr) {
        checkErrors(error, stderr, done)
        exec('node profitbricks.js server start --datacenterid ' + dcid + ' -i ' + sid + ' --json', function(error, stdout, stderr) {
            checkErrors(error, stderr, done)
            done()
        })
    })
}

function rebootServer(done){
    exec('node profitbricks.js server reboot --datacenterid ' + dcid + ' -i ' + sid + ' --json', function(error, stdout, stderr) {
        checkErrors(error, stderr, done)
        done()
    })
}

function serverShow(done) {
    exec('node profitbricks.js server show --datacenterid ' + dcid + ' -i ' + sid + ' --json', function(error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        assert.equal(data[0].Id, sid)
        done()
    })
}

function serverCreateScript(done) {
    var script = './scripts/server.json'
    exec('node profitbricks.js server create --datacenterid ' + dcid + ' -p ' + script + ' --json', function(error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        sid = data[0].Id
        done()
    })
}

function serverCreateParams(done) {
    var name = "PB_CLI_Test_Server"
    var cores = "1"
    var ram = "1024"
    exec('node profitbricks.js server create --json ' +
        ' --datacenterid  ' + dcid +
        ' --cores ' + cores +
        ' --name ' + name +
        ' --ram ' + ram +
        ' --size ' + '1',
        function(error, stdout, stderr) {
            checkErrors(error, stderr, done)
            var data = JSON.parse(stdout)
            if (data.length) {
                assert.equal(data[0].Name, name)
                done()
            }
        })
}

function serverUpdate(done) {
    var name = "PB_CLI_Test_Server_UPDATED"
    var cores = "2"
    exec('node profitbricks.js server update --json ' +
        '-i ' + sid +
        ' --datacenterid ' + dcid +
        ' --name ' + name +
        ' --cores ' + cores,
        function(error, stdout, stderr) {
            checkErrors(error, stderr, done)
            var data = JSON.parse(stdout)
            if (data.length) {
                assert.equal(data[0].Name, name)
                assert.equal(data[0].Cores, cores)
                done()
            }
        })
}

function serverDelete(done) {
    exec('node profitbricks.js server delete ' +
        '--datacenterid ' + dcid +
        ' -i ' + sid + ' --json --force',
        function(error, stdout, stderr) {
            checkErrors(error, stderr, done)
            assert.equal(stdout, '')
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