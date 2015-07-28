var assert = require("assert")
var exec = require('child_process').exec
var pbclient = require('libprofitbricks')
var helpers = require('../helpers')

var imgid = ''

describe('Image tests', function(){
    // Long timeout needed since mocha fails test if done() is not called in 2 seconds
    this.timeout(20000);

    it('Lists images', function(done){
        imagesGet(done)
    })

    it('Shows image', function(done){
        imageShow(done)
    })

    // Public image cannot be updated
    it('NEGATIVE: Updates image', function(done){
        imageUpdate(done)
    })

    // Public image cannot be deleted
    it('NEGATIVE: Deletes image', function(done){
        imageDelete(done)
    })

})

function imagesGet(done) {
    exec('node profitbricks.js image list --json', function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        imgid = data[0].Id
        done()
    })
}

function imageShow(done) {
    exec('node profitbricks.js image show --json' +
    ' -i ' + imgid, function (error, stdout, stderr) {
        checkErrors(error, stderr, done)
        var data = JSON.parse(stdout)
        assert.equal(data.length > 0, true)
        assert.equal(data[0].Id, imgid)
        done()
    })
}

function imageUpdate(done) {
    var name = 'Test_image_UPD'
    exec('node profitbricks.js image update --json' +
    ' --name ' + name +
    ' -i ' + imgid, function (error, stdout, stderr) {
        //checkErrors(error, stderr, done)
        //var data = JSON.parse(stdout)
        //assert.equal(data.length > 0, true)
        assert.equal(error.code, 5)
        done()
    })
}

function imageDelete(done) {
    exec('node profitbricks.js image delete --json --force' +
    ' -i ' + imgid, function (error, stdout, stderr) {
        //checkErrors(error, stderr, done)
        assert.equal(error.code, 5)
        done()
    })
}

function checkErrors(error, stderr, done) {
    if (error || stderr) {
        throw {description: stderr, stack: error}
    }
}
