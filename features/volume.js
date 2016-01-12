var pbclient = require('libprofitbricks')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processVolume

function processVolume(params) {
    if (!params.datacenterid || params.datacenterid == true) {
        console.error('please provide datacenterid')
        process.exit(code = 5)
        return
    }
    switch (params.volume) {
        case 'attach':
            pbclient.attachVolume(params.datacenterid, params.serverid, params.id, helpers.printInfo)
            break
        case 'detach':
            pbclient.detachVolume(params.datacenterid, params.serverid, params.id, helpers.printInfo)
            break
        case 'list':
            pbclient.listVolumes(params.datacenterid, helpers.printInfo)
            break
        case 'get':
        case 'show':
            pbclient.getVolume(params.datacenterid, params.id, helpers.printInfo)
            break
        case 'create':
            createVolume(params)
            break
        case 'update':
            updateVolume(params)
            break
        case 'delete':
            if (!global.force) {
                console.log('You are about to delete a volume. Do you want to proceed? (y/n')
                prompt.get(['yes'], function (err, result) {
                    if (result.yes == 'yes' || result.yes == 'y')
                        pbclient.deleteVolume(params.datacenterid, params.id, helpers.printInfo)
                    else
                        process.exit(code = 0)
                })
            } else
                pbclient.deleteVolume(params.datacenterid, params.id, helpers.printInfo)
            break
        default:
            params.outputHelp()
            break
    }
}

function createVolume(params) {
    var data = {}
    try {
        if (params.path) {
            data = JSON.parse(fs.readFileSync(params.path, 'utf8'))
        } else {
            data.properties = {}
            if (params.name)
                data.properties.name = params.name
            if (params.size)
                data.properties.size = params.size
            else {
                console.error("Size is required field.")
                process.exit(code = 5)
                return
            }
            if (params.bus)
                data.properties.bus = params.bus
            if (params.licenceType && params.image) {
                console.log('licenceType parameter should be used only if no image is used.')
                console.log('licenceType will be inherited from image.')
                console.log("Exiting...")
                process.exit(code = 5)
            }

            if (params.licencetype)
                data.properties.licenceType = params.licencetype
            if (params.imageid)
                data.properties.image = params.imageid
            if (params.type)
                data.properties.type = params.type
            if (params.imagepassword)
                data.properties.imagePassword = params.imagepassword
        }
    } finally {
        pbclient.createVolume(params.datacenterid, data, helpers.printInfo)
    }
}

function updateVolume(params) {
    var data = {}

    if (!params.id) {
        console.error("Volume Id is a required field.")
        process.exit(code = 5)
    }

    if (params.name)
        data.name = params.name
    if (params.bus)
        data.bus = params.bus
    if (params.size)
        data.size = params.size

    pbclient.patchVolume(params.datacenterid, params.id, data, helpers.printInfo)
}