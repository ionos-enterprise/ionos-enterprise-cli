var pbclient = require('libionosenterprise')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processLoadBalancer

function processLoadBalancer(params) {
    if (!params.datacenterid || params.datacenterid == true) {
        console.error('please provide datacenterid')
        process.exit(code = 5)
    }
    switch (params.loadbalancer) {
        case 'list':
            pbclient.listLoadbalancers(params.datacenterid, helpers.printInfo)
            break
        case 'get':
        case 'show':
            pbclient.getLoadbalancer(params.datacenterid, params.id, helpers.printInfo)
            break
        case 'create':
            createLoadbalancer(params)
            break
        case 'update':
            updateLoadbalancer(params)
            break
        case 'delete':
            if (!params.id || params.id == true) {
                console.error('Please provide Loadbalancer Id --id, -i [loadbalancer_id]')
                process.exit(code = 5)
                return
            }
            if (!global.force) {
                pbclient.getLoadbalancer(params.datacenterid, params.id, function(error, response, body) {
                    if (response.statusCode > 299) {
                        console.log("Object you are trying to delete does not exist")

                    } else {
                        var info = JSON.parse(body)

                        console.log('You are about to delete "' + info.properties.name + '" Loadbalancer. Do you want to proceed? (y/n)')
                        prompt.get(['yes'], function(err, result) {
                            if (result.yes == 'yes' || result.yes == 'y' || result.yes == '')
                                pbclient.deleteLoadbalancer(params.datacenterid, params.id, helpers.printInfo)
                            else
                                process.exit(code = 0)
                        })
                    }
                })
            } else
                pbclient.deleteLoadbalancer(params.datacenterid, params.id, helpers.printInfo)
            break
        default:
            params.outputHelp()
            break
    }
}

function createLoadbalancer(params) {
    var data = {}

    if (!params.datacenterid) {
        console.error("DataCenter Id is a required field.")
        process.exit(code = 5)
    }
    try {
        if (params.path) {
            data = JSON.parse(fs.readFileSync(params.path, 'utf8'))
        } else {
            data.properties = {}
            if (params.name)
                data.properties.name = params.name
            else {
                console.error("Name is a required field.")
                process.exit(code = 5)
            }
            data.properties.ip = params.ip
            data.properties.dhcp = params.dhcp
        }
    } finally {
        pbclient.createLoadbalancer(params.datacenterid, data, helpers.printInfo)
    }
}

function updateLoadbalancer(params) {
    var data = {}

    if (!params.datacenterid) {
        console.error("DataCenter Id is a required field.")
        process.exit(code = 5)
    }
    if (!params.id) {
        console.error("Loadbalancer Id is a required field.")
        process.exit(code = 5)
    }

    try {
        if (params.path) {
            data = JSON.parse(fs.readFileSync(params.path, 'utf8'))
        } else {
            if (params.name)
                data.name = params.name
            if (params.ip)
                data.ip = params.ip
            if (params.dhcp)
                data.dhcp = params.dhcp
        }
    } finally {
        pbclient.patchLoadbalancer(params.datacenterid, params.id, data, helpers.printInfo)
    }
}
