var pbclient = require('libprofitbricks')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processRequest

function processRequest(params) {

	if (params.location == "list") {
		pbclient.listLocations(helpers.printInfo)
	}
}
