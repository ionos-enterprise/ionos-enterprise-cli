var pbclient = require('libionosenterprise')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processResources

// listing resources may be time-consuming
pbclient.setdepth(1)


function processResources(params) {
    switch (params.resource) {
        case 'list':
            if (params.resourcetype)
                pbclient.listResourcesByType(params.resourcetype, helpers.printInfo)
            else
                pbclient.listResources(helpers.printInfo)
            break;
        case 'get':
        case 'show':
            if (!params.resourcetype || params.resourcetype == true) {
                console.error("Resource type is a required field. --resourcetype [env]")
                process.exit(code = 5)
            }
            if (!params.id || params.id == true) {
                console.error("Resource ID is a required field. -i [env]")
                process.exit(code = 5)
            }
            pbclient.getResourceByType(params.resourcetype, params.id, helpers.printInfo)
            break;
        default:
            params.outputHelp()
            break
    }
}
