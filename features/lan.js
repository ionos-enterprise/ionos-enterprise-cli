var pbclient = require('libprofitbricks')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processLan

function processLan(params) {
    if (!params.datacenterid || params.datacenterid == true) {
        console.error("Data Center ID is a required field. --datacenterid [env]")
        process.exit(code = 5)
    }
    switch (params.lan) {
        case 'list':
            pbclient.listLans(params.datacenterid, helpers.printInfo)
            break
        case 'get':
        case 'show':
            pbclient.getLan(params.datacenterid, params.id, helpers.printInfo)
            break
        case 'create':
            createLan(params)
            break
        case 'update':
            updateLan(params)
            break
        case 'delete':
            if (!global.force) {
                console.log('You are about to delete a LAN. Do you want to proceed? (y/n')
                prompt.get(['yes'], function (err, result) {
                    if (result.yes == 'yes' || result.yes == 'y')
                        pbclient.deleteLan(params.datacenterid, params.id, helpers.printInfo)
                    else
                        process.exit(code = 0)
                })
            } else
                pbclient.deleteLan(params.datacenterid, params.id, helpers.printInfo)
            break
        default:
            params.outputHelp()
            break
    }
}

function updateLan(params) {
    var data = {}
    data.public = params.public

    pbclient.patchLan(params.datacenterid,params.id,data,helpers.printInfo)
}

function createLan(params) {
    var data = {}
    try {
        if (params.path) {
            data = JSON.parse(fs.readFileSync(params.path, 'utf8'))
        }
        else {
            data.properties = {}
            if (params.public)
                data.properties.public = params.public

            if (params.name)
                data.properties.name = params.name
        }
    }
    finally {
        pbclient.createLan(params.datacenterid, data, helpers.printInfo)
    }
}