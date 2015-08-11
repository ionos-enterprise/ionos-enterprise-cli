var pbclient = require('libprofitbricks')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processServer

function processServer(params) {
    if (!params.datacenterid || params.datacenterid == true) {
        console.error('Please provide Data Center Id --datacenterid [dcid]')
        process.exit(code = 5)
        return
    }

    switch (params.server) {
        case 'list':
            pbclient.listServers(params.datacenterid, helpers.printInfo)
            break
        case 'get':
        case 'show':
            pbclient.getServer(params.datacenterid, params.id, helpers.printInfo)
            break
        case 'create':
            createServer(params)
            break
        case 'update':
            updateServer(params)
            break
        case 'start':
            pbclient.startServer(params.datacenterid, params.id, helpers.printInfo)
            break
        case 'stop':
            pbclient.stopServer(params.datacenterid, params.id, helpers.printInfo)
            break
        case 'reboot':
            pbclient.rebootServer(params.datacenterid, params.id, helpers.printInfo)
            break
        case 'delete':
            if (!global.force) {
                console.log('You are about to delete a server. Do you want to proceed? (y/n')
                prompt.get(['yes'], function(err, result) {
                    console.log(result.yes)
                    if (result.yes == 'yes' || result.yes == 'y')
                        pbclient.deleteServer(params.datacenterid, params.id, helpers.printInfo)
                    else
                        process.exit(code = 0)
                })
            } else
                pbclient.deleteServer(params.datacenterid, params.id, helpers.printInfo)

            break
        default:
            params.outputHelp()
            break
    }
}

function createServer(params) {
    var data = {}
    try {
        if (params.path) {
            data = JSON.parse(fs.readFileSync(params.path, 'utf8'))
        } else {
            data.properties = {}
            if (params.name)
                data.properties.name = params.name
            else {
                console.error("Name is required field. -n, --name [env]")
                process.exit(code = 5)
                return
            }
            if (params.cores)
                data.properties.cores = params.cores
            else {
                console.error("Cores are required field. -c, --cores [env]")
                process.exit(code = 5)
                return
            }

            if (params.ram)
                data.properties.ram = params.ram
            else {
                console.error("RAM is required field. -r, --ram [env]")
                process.exit(code = 5)
                return
            }
        }
    } finally {
        pbclient.createServer(params.datacenterid, data, helpers.printInfo)
    }
}

function updateServer(params) {
    var data = {}

    if (!params.id) {
        console.error("Server Id is a required field.")
        process.exit(code = 5)
    }

    if (params.name)
        data.name = params.name
    if (params.cores)
        data.cores = params.cores
    if (params.ram)
        data.ram = params.ram
    if (params.availabilityzone)
        data.availabilityzone = params.availabilityzone
    if (params.licencetype)
        data.licencetype = params.licencetype

    if (params.bootCdrom && params.bootVolume) {
        console.log('If not bootCdrom is ‘null’ then bootVolume has to be ‘null’, and the other way around')
        console.log("Exiting...")
        process.exit(code = 5)
    }

    if (params.bootCdrom)
        data.bootCdrom = params.bootCdrom
    if (params.bootVolume)
        data.bootVolume = params.bootVolume

    pbclient.patchServer(params.datacenterid, params.id, data, helpers.printInfo)
}