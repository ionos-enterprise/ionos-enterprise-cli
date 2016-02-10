var pbclient = require('libprofitbricks')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processNic

function processNic(params) {
    if (!params.datacenterid || params.datacenterid == true) {
        console.error("DataCenter Id is a required field.")
        process.exit(code = 5)
    }
    if ((!params.serverid || params.serverid == true) && (!params.loadbalancerid || params.loadbalancerid == true)) {
        console.error("Server Id is a required field.")
        process.exit(code = 5)
    }

    switch (params.nic) {
        case 'list':
            if (params.serverid) {
                pbclient.listNics(params.datacenterid, params.serverid, helpers.printInfo)
            } else if (params.loadbalancerid) {

                pbclient.listBalancedNics(params.datacenterid, params.loadbalancerid, helpers.printInfo)
            }
            break
        case 'attach':
            var jason = {}
            jason.id = params.id
            pbclient.associateNics(params.datacenterid, params.loadbalancerid, jason, helpers.printInfo)
            break
        case 'detach':
            pbclient.deleteBalancedNic(params.datacenterid, params.loadbalancerid, params.id, helpers.printInfo)
            break
        case 'get':
        case 'show':
            pbclient.getNic(params.datacenterid, params.serverid, params.id, helpers.printInfo)
            break
        case 'create':
            createNic(params)
            break
        case 'update':
            updateNic(params)
            break
        case 'delete':
            if (!global.force) {
                console.log('You are about to delete a snapshot. Do you want to proceed? (y/n')
                prompt.get(['yes'], function (err, result) {
                    if (result.yes == 'yes' || result.yes == 'y')
                        pbclient.deleteNic(params.datacenterid, params.serverid, params.id, helpers.printInfo)
                    else
                        process.exit(code = 0)
                })
            }
            else
                pbclient.deleteNic(params.datacenterid, params.serverid, params.id, helpers.printInfo)
            break
        default:
            params.outputHelp()
            break
    }
}

function createNic(params) {

    var data = {}
    try {
        if (params.path) {
            data = JSON.parse(fs.readFileSync(params.path, 'utf8'))
        }
        else {
            data.properties = {}
            data.properties.name = params.name
            if (params.ip)
                data.properties.ips = [params.ip]
            data.properties.dhcp = params.dhcp
            if (params.lan)
                data.properties.lan = params.lan
            else {
                console.error("LAN is a required field.")
                process.exit(code = 5)
            }
        }
    }
    finally {
        pbclient.createNic(params.datacenterid, params.serverid, data, helpers.printInfo)
    }
}

function updateNic(params) {
    var data = {}
    var isUpdated = false;
    try {
        if (params.path) {
            data = JSON.parse(fs.readFileSync(params.path, 'utf8'))
        }
        else if (params.addip) {

            pbclient.getNic(params.datacenterid, params.serverid, params.id, function (err, response, body) {
                var info = JSON.parse(body)
                if (info) {


                    if (info.properties && info.properties.ips) {
                        info.properties.ips.push(params.addip)
                        data.ips = info.properties.ips
                        pbclient.patchNic(params.datacenterid, params.serverid, params.id, data, helpers.printInfo)
                    } else {
                        console.log(body)
                    }
                }

                isUpdated = true
            })

            isUpdated = true
            return
        } else if (params.removeip) {

            pbclient.getNic(params.datacenterid, params.serverid, params.id, function (err, response, body) {
                var info = JSON.parse(body)
                if (info) {
                    if (info.properties && info.properties.ips) {
                        info.properties.ips.indexOf(params.removeip)

                        var index = info.properties.ips.indexOf(params.removeip)
                        if (index != -1) {
                            info.properties.ips.splice(index, 1)

                            data.ips = info.properties.ips
                        }
                        pbclient.patchNic(params.datacenterid, params.serverid, params.id, data, helpers.printInfo)
                        isUpdated = true
                    } else {
                        console.log(body)
                    }
                }

                isUpdated = true
            })

            isUpdated = true

        } else {
            console.log("DA DA")
            data = {}
            if (params.name)
                data.name = params.name
            if (params.ip)
                data.ips = [params.ip]
            if (params.dhcp)
                data.dhcp = params.dhcp
            if (params.lan)
                data.lan = params.lan

        }
    }
    finally {
        if (isUpdated == false) {
            //  pbclient.patchNic(params.datacenterid, params.serverid, params.id, data, helpers.printInfo)
        }
    }

}