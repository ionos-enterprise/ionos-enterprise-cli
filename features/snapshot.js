var pbclient = require('libprofitbricks')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processSnapshot

function processSnapshot(params) {
    switch (params.snapshot) {
        case 'list':
            pbclient.listSnapshots(helpers.printInfo)
            break
        case 'get':
        case 'show':
            if (!params.id) {
                console.error("Snapshot Id is a required field.")
                process.exit(code = 5)
            }
            pbclient.getSnapshot(params.id, helpers.printInfo)
            break
        case 'create':
            createSnapshot(params)
            break
        case 'update':
            updateSnapshot(params)
            break
        case 'delete':
            if (!params.id || params.id == true) {
                console.error('Please provide Snapshot Id --id, -i [snapshot_id]')
                process.exit(code = 5)
                return
            }
            if (!global.force) {
                pbclient.getSnapshot(params.id, function(error, response, body) {
                    if (response.statusCode > 299) {
                        console.log("Object you are trying to delete does not exist")

                    } else {
                        var info = JSON.parse(body)

                        console.log('You are about to delete "' + info.properties.name + '" server. Do you want to proceed? (y/n)')
                        prompt.get(['yes'], function(err, result) {
                            if (result.yes == 'yes' || result.yes == 'y' || result.yes == '')
                                pbclient.deleteSnapshot(params.id, helpers.printInfo)
                            else
                                process.exit(code = 0)
                        })
                    }
                })
            } else
                pbclient.deleteSnapshot(params.id, helpers.printInfo)
            break
        default:
            params.outputHelp()
            break
    }
}

function createSnapshot(params) {
    var data = {}
    data = {}

    if (params.name)
        data.name = params.name
    if (params.description)
        data.description = params.description
    if (!params.datacenterid || params.datacenterid == true) {
        console.error("Data Center Id is a required field.")
        process.exit(code = 5)
    }
    if (!params.volumeid || params.volumeid == true) {
        console.error("Volume Id is a required field.")
        process.exit(code = 5)
    }
    pbclient.createSnapshot(params.datacenterid, params.volumeid, data, helpers.printInfo)
}

function updateSnapshot(params) {
    if (!params.id) {
        console.error("Snapshot Id is a required field.")
        process.exit(code = 5)
    }
    var data = {}

    if (params.name)
        data.name = params.name
    if (params.description)
        data.description = params.description
    if (params.licencetype)
        data.licencetype = params.licencetype
    if (params.cpuHotPlug)
        data.cpuHotPlug = params.cpuHotPlug
    if (params.cpuHotUnplug)
        data.cpuHotUnplug = params.cpuHotUnplug
    if (params.ramHotPlug)
        data.ramHotPlug = params.ramHotPlug
    if (params.ramHotUnplug)
        data.ramHotUnplug = params.ramHotUnplug
    if (params.nicHotPlug)
        data.nicHotPlug = params.nicHotPlug
    if (params.nicHotUnplug)
        data.nicHotUnplug = params.nicHotUnplug
    if (params.discVirtioHotPlug)
        data.discVirtioHotPlug = params.discVirtioHotPlug
    if (params.discVirtioHotUnplug)
        data.discVirtioHotUnplug = params.discVirtioHotUnplug
    if (params.discScsiHotPlug)
        data.discScsiHotPlug = params.discScsiHotPlug
    if (params.discScsiHotUnplug)
        data.discScsiHotUnplug = params.discScsiHotUnplug

    pbclient.patchSnapshot(params.id, data, helpers.printInfo)
}
