var pbclient = require('libprofitbricks')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processLocation

function processLocation(params) {

    if (params.location == "list") {
        pbclient.listLocations(helpers.printInfo)
    }
}
