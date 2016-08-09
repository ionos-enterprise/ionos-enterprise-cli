var pbclient = require('libprofitbricks')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processDrives


function processDrives(params) {
    switch (params.drives) {
        case 'list':
            pbclient.listAttachedCdroms(params.datacenterid, params.serverid, helpers.printInfo)
            break;
        case 'get':
        case 'show':
            pbclient.getAttachedCdrom(params.datacenterid, params.serverid, params.id, helpers.printInfo)
            break;
        case 'attach':
            pbclient.attachCdrom(params.datacenterid, params.serverid, params.id, helpers.printInfo)
            break
        case 'detach':
            pbclient.detachCdrom(params.datacenterid, params.serverid, params.id, helpers.printInfo)
            break
        default:
            params.outputHelp()
            break
    }
}
