var pbclient = require('libionosenterprise')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processContract

function processContract(params) {

    if (params.contract == "list") {
        pbclient.listContractResources(helpers.printContractResources)
    } else {
        params.outputHelp()
    }
}
