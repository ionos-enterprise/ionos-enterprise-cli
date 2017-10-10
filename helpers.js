/**
 * Created by jasmin.gacic on 03/11/15.
 */

var fs = require('fs')
exports.toBase64 = toBase64
exports.getAuthData = getAuthData
exports.printInfo = printInfo
exports.setJson = setJson
exports.setForce = setForce
exports.force = force

var authFile = (process.env.HOME || process.env.USERPROFILE) + '/.profitbricks-auth'

var isJson = false
var force = false


function toBase64(user, pass) {
    var header = typeof pass !== 'undefined' ? user + ':' + pass : user
    writeAuthData((new Buffer(header || '', 'ascii')).toString('base64'))
}

function writeAuthData(authData) {
    fs.writeFile(authFile, authData, function() {
        fs.chmodSync(authFile, '0600')
    })
}

function getAuthData() {
    if (fs.existsSync(authFile))
        return fs.readFileSync(authFile).toString()
}

function printInfo(error, response, body) {
    /*console.log(body)
      console.log(error)*/

    if (response.headers) {
        location = response.headers.location
    }

    if (error) {
        console.error(error)
        process.exit(code = 5)
    }

    if (response) {
        if (response.statusCode > 299) {
            error = {
                'errorcode': response.statusCode,
                'errormsg': body
            }
            console.error(error)
            process.exit(code = 5)
        }
    }

    if (body != "") {
        try {
            var info = JSON.parse(body)
        } catch (err) {
            console.log("Whatever")
            return
        }
    }

    // handle request ID for JSON output, if exists
    var requestId = null
    if (location) {
        splice = location.split("/")
        requestId = splice[6]
    }

    if (body) {
        switch (info.type) {
            case 'datacenter':
                if (info.href.indexOf('um/resources/datacenter') > -1)
                    printResults('Resource', [printResource(info)], requestId)
                else
                    printResults('Datacenter', [printDc(info)], requestId)
                break
            case 'server':
                printResults('Server', [printServer(info)], requestId)
                break
            case 'volume':
                printResults('Volume', [printVolume(info)], requestId)
                break
            case 'image':
                if (info.href.indexOf('um/resources/image') > -1)
                    printResults('Resource', [printResource(info)], requestId)
                else
                    printResults('Image', [printImage(info)], requestId)
                break
            case 'snapshot':
                if (info.href.indexOf('um/resources/snapshot') > -1)
                    printResults('Resource', [printResource(info)], requestId)
                else
                    printResults('Snapshot', [printSnapshot(info)], requestId)
                break
            case 'loadbalancer':
                printResults('Loadbalancer', [printLoadbalancer(info)], requestId)
                break
            case 'nic':
                printResults('Nic', [printNic(info)], requestId)
                break
            case 'ipblock':
                if (info.href.indexOf('um/resources/ipblock') > -1)
                    printResults('Resource', [printResource(info)], requestId)
                else
                    printResults('IP Block', [printIpblock(info)], requestId)
                break
            case 'lan':
                printResults('LAN', [printLan(info)], requestId)
                break
            case 'firewall-rule':
                printResults('Firewall Rule', [printFW(info)], requestId)
                break
            case 'collection':
                if (info.id == 'resources')
                    printResourceCollection(info)
                else
                    printCollection(info)
                break
            case 'location':
                printResults('Image Alias', info.properties.imageAliases, requestId)
                break
            case 'group':
                printResults('Group', [printGroup(info)], requestId)
                break
            case 'user':
                printResults('User', [printUser(info)], requestId)
                break
            case 'resource':
                printResults('Shared resource', [printShare(info)], requestId)
                break
            case 'request-status':
                if (!isJson) {
                    console.log("Status: " + info.metadata.targets[0].status)
                    console.log("Message: " + info.metadata.message)
                } else {
                    console.log(JSON.stringify(info))
                }
                break

        }
    }
    if (requestId) {
        if (!isJson)
            console.log("RequestID: " + requestId)
        else
            if (!body)
                console.log('{"RequestID":"' + requestId + '"}')
    }
}

function setJson(flag) {
    isJson = flag
}

function setForce(flag) {
    force = flag
}

function printDc(info) {
    var obj = {}
    if (info.id)
        obj.Id = info.id
    if (info.properties) {
        if (info.properties.name)
            obj.Name = info.properties.name
        if (info.properties.location)
            obj.Location = info.properties.location
    }

    return obj
}

function printServer(info) {
    return {
        Id: info.id,
        Name: info.properties.name,
        AvailabilityZone: info.properties.availabilityZone,
        State: info.metadata.state,
        Cores: info.properties.cores,
        Memory: info.properties.ram + "MB"
    }
}

function printVolume(info) {
    return {
        Id: info.id,
        Name: info.properties.name,
        Size: info.properties.size + "GB",
        Licence: info.properties.licenceType,
        Bus: info.properties.bus,
        State: info.metadata.state
    }
}

function printSnapshot(info) {
    return {
        Id: info.id,
        Name: info.properties.name,
        Size: info.properties.size,
        Created: info.metadata.createdDate.toString(),
        State: info.metadata.state.toString()
    }
}

function printLoadbalancer(info) {
    return {
        Id: info.id,
        Name: info.properties.name,
        Created: info.metadata.createdDate.toString(),
        State: info.metadata.state.toString()

    }
}

function printNic(info) {
    return {
        Id: info.id,
        Name: info.properties.name,
        Created: info.metadata.createdDate.toString(),
        State: info.metadata.state.toString(),
        Lan: info.properties.lan.toString(),
        Mac: info.properties.mac,
        Ips: info.properties.ips
    }
}

function printFW(info) {
    return {
        Id: info.id,
        Name: info.properties.name,
        Created: info.metadata.createdDate.toString(),
        State: info.metadata.state.toString(),
        Lan: info.properties.protocol.toString(),
        SourceMac: info.properties.sourceMac,
        SourceIp: info.properties.sourceIp
    }
}


function printIpblock(info) {
    return {
        Id: info.id,
        Name: info.properties.name,
        IPs: info.properties.ips,
        Location: info.properties.location.toString()
    }
}

function printLan(info) {
    return {
        Id: info.id,
        Name: info.properties.name,
        Created: info.metadata.createdDate.toString(),
        Public: info.properties.public.toString()
    }
}

function printImage(info) {
    return {
        Id: info.id,
        Name: info.properties.name,
        State: info.metadata.state.toString(),
        Type: info.properties.imageType,
        Location: info.properties.location,
        Public: info.properties.public
    }
}

function printLocation(info) {
    return {
        Id: info.id,
        Name: info.properties.name
    }
}

function printGroup(info) {
    return {
        Id: info.id,
        Name: info.properties.name,
        CreateDC: info.properties.createDataCenter,
        CreateSnapshot: info.properties.createSnapshot,
        ReserveIP: info.properties.reserveIp,
        AccessActLog: info.properties.accessActivityLog
    }
}

function printUser(info) {
    return {
        Id: info.id,
        FirstName: info.properties.firstname,
        LastName: info.properties.lastname,
        Email: info.properties.email,
        Admin: info.properties.administrator
    }
}

function printShare(info) {
    return {
        Id: info.id,
        EditPrivilege: info.properties.editPrivilege,
        SharePrivilege: info.properties.sharePrivilege
    }
}

function printResource(info) {
    return {
        Id: info.id,
        Type: info.type,
        Created: info.metadata.createdDate,
        By: info.metadata.createdBy,
        State: info.metadata.state
    }
}

function printCollection(info) {
    var dc = []
    var type = ''

    for (var i = 0; i < info.items.length; i++) {
        switch (info.items[i].type) {
            case 'datacenter':
                type = info.items[i].type
                dc.push(printDc(info.items[i]))
                break
            case 'server':
                type = info.items[i].type
                dc.push(printServer(info.items[i]))
                break
            case 'volume':
                type = info.items[i].type
                dc.push(printVolume(info.items[i]))
                break
            case 'snapshot':
                type = info.items[i].type
                dc.push(printSnapshot(info.items[i]))
                break
            case 'loadbalancer':
                type = info.items[i].type
                dc.push(printLoadbalancer(info.items[i]))
                break
            case 'nic':
                type = info.items[i].type
                dc.push(printNic(info.items[i]))
                break
            case 'ipblock':
                type = info.items[i].type
                dc.push(printIpblock(info.items[i]))
                break
            case 'lan':
                type = info.items[i].type
                dc.push(printLan(info.items[i]))
                break
            case 'image':
                type = info.items[i].type
                dc.push(printImage(info.items[i]))
                break
            case 'location':
                type = info.items[i].type
                dc.push(printLocation(info.items[i]))
                break
            case 'firewall-rule':
                type = info.items[i].type
                dc.push(printFW(info.items[i]))
                break
            case 'group':
                type = info.items[i].type
                dc.push(printGroup(info.items[i]))
                break
            case 'user':
                type = info.items[i].type
                dc.push(printUser(info.items[i]))
                break
            case 'resource':
                type = 'Shared ' + info.items[i].type
                dc.push(printShare(info.items[i]))
                break
        }
    }
    printResults(type.capitalize() + 's', dc, null)
}

function printResourceCollection(info) {
    var data = []

    for (var i = 0; i < info.items.length; i++) {
        data.push(printResource(info.items[i]))
    }
    printResults('Resources', data, null)
}

function printResults(title, value, requestId) {
    if (isJson) {
        if (requestId)
            value[0].RequestID = requestId
        console.log(JSON.stringify(value))
    }
    else
        console.table(title, value)
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}
