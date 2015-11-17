var pbclient = require('libprofitbricks')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processRequest

function processRequest(params) {
	if (!params.id || params.requestid == true) {
		console.error('Please provide requestid --id [request_id]')
        process.exit(code = 5)
        return
    }

	if (params.request == "get") {
		pbclient.statusRequest(params.id, helpers.printInfo)
	}
}
