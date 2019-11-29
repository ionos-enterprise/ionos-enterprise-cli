var pbclient = require('libionosenterprise')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processFirewall

function processFirewall(params) {
    if (!params.datacenterid || params.datacenterid == true) {
        console.error('please provide datacenterid')
        process.exit(code = 5)
    }
    if ((!params.serverid || params.serverid == true) && (!params.id || params.ids == true)) {
        console.error("Server Id is a required field.")
        process.exit(code = 5)
    }
    if ((!params.nicid || params.nicId == true) && (!params.loadbalancerid || params.loadbalancerid == true)) {
        console.error("NIC Id is a required field.")
        process.exit(code = 5)
    }

    switch (params.firewall) {
        case 'list':
            pbclient.listFWRules(params.datacenterid, params.serverid, params.nicid, helpers.printInfo)
            break
        case 'get':
        case 'show':
            pbclient.getFWRule(params.datacenterid, params.serverid, params.nicid, params.id, helpers.printInfo)
            break
        case 'create':
            createFirewallRule(params)
            break
        case 'update':
            updateFirewallRule(params)
            break
        case 'delete':
        console.log(params.datacenterid, params.serverid, params.nicid, params.id)
            if (!params.id || params.id == true) {
                console.error('Please provide Firewall Rule Id --id, -i [firewall_id]')
                process.exit(code = 5)
                return
            }
            if (!global.force) {
                pbclient.getFWRule(params.datacenterid, params.serverid, params.nicid, params.id, function(error, response, body) {
                    if (response.statusCode > 299) {
                        console.log("Object you are trying to delete does not exist")

                    } else {
                        var info = JSON.parse(body)

                        console.log('You are about to delete "' + info.properties.name + '" Firewall Rule. Do you want to proceed? (y/n)')
                        prompt.get(['yes'], function(err, result) {
                            if (result.yes == 'yes' || result.yes == 'y' || result.yes == '')
                                pbclient.delFWRule(params.datacenterid, params.serverid, params.nicid, params.id, helpers.printInfo)
                            else
                                process.exit(code = 0)
                        })
                    }
                })
            } else
                pbclient.delFWRule(params.datacenterid, params.serverid, params.nicid, params.id, helpers.printInfo)
            break
        default:
            params.outputHelp()
            break
    }
}

function createFirewallRule(params) {
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
            if (params.protocol)
                data.properties.protocol = params.protocol
            else {
                console.error("Protocol a required field.")
                process.exit(code = 5)
            }
            data.properties.name = params.name
            data.properties.sourceMac = params.sourceMac
            data.properties.sourceIp = params.sourceIp
            data.properties.targetIp = params.targetIp
            data.properties.portRangeStart = params.portRangeStart
            data.properties.portRangeEnd = params.portRangeEnd
            data.properties.icmpType = params.icmpType
            data.properties.icmpCode = params.icmpCode
        }
    } finally {
        pbclient.createFWRule(params.datacenterid, params.serverid, params.nicid, data, helpers.printInfo)
    }
}

function updateFirewallRule(params) {
    var data = {}

    if (!params.datacenterid) {
        console.error("DataCenter Id is a required field.")
        process.exit(code = 5)
    }
    if (!params.id) {
        console.error("Nic Id is a required field.")
        process.exit(code = 5)
    }

    try {
        if (params.path) {
            data = JSON.parse(fs.readFileSync(params.path, 'utf8'))
        } else {
            if (params.name)
                data.name = params.name
            if (params.sourceMac)
                data.sourceMac = params.sourceMac
            if (params.sourceIp)
                data.sourceIp = params.sourceIp
            if (params.targetIp)
                data.targetIp = params.targetIp
            if (params.portRangeStart)
                data.portRangeStart = params.portRangeStart
            if (params.portRangeEnd)
                data.portRangeEnd = params.portRangeEnd
            if (params.icmpCode)
                data.icmpCode = params.icmpCode
            if (params.icmpType)
                data.icmpType = params.icmpType
        }
    } finally {
        pbclient.patchFWRule(params.datacenterid, params.serverid, params.nicid, params.id, data, helpers.printInfo)
    }
}