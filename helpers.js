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

var authFile = (process.env.HOME || process.env.USERPROFILE) + '/.auth'

var isJson = false
var force = false


function toBase64(user, pass) {
    var header = typeof pass !== 'undefined' ? user + ':' + pass : user
    writeAuthData((new Buffer(header || '', 'ascii')).toString('base64'))
}

function writeAuthData(authData) {
    fs.writeFile(authFile, authData, function() {})
}

function getAuthData() {
    if (fs.existsSync(authFile))
        return fs.readFileSync(authFile).toString()
}

function printInfo(error, response, body) {
    /* console.log(body)
     console.log(error)
     console.log(response)*/
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

    try {
        var info = JSON.parse(body)
    } catch (err) {
        return
    }
    
    if (body) {
        switch (info.type) {
            case 'datacenter':
                printResults('Datacenter', [printDc(info)])
                break
            case 'server':
                printResults('Server', [printServer(info)])
                break
            case 'volume':
                printResults('Volume', [printVolume(info)])
                break
            case 'image':
                printResults('Volume', [printImage(info)])
                break
            case 'snapshot':
                printResults('Snapshot', [printSnapshot(info)])
                break
            case 'loadbalancer':
                printResults('Loadbalancer', [printLoadbalancer(info)])
                break
            case 'nic':
                printResults('Nic', [printNic(info)])
                break
            case 'ipblock':
                printResults('IP Block', [printIpblock(info)])
                break
            case 'lan':
                printResults('LAN', [printLan(info)])
                break
            case 'collection':
                printCollection(info)
                break
        }
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
        AavailabilityZone: info.properties.availabilityZone,
        State: info.metadata.state,
        Cores: info.properties.cores,
        Memory: info.properties.ram + "RAM"
    }
}

function printVolume(info) {
    return {
        Id: info.id,
        Name: info.properties.name,
        Size: info.properties.size,
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
        State: info.metadata.state.toString()
    }
}

function printIpblock(info) {
    return {
        Id: info.id,
        IPs: info.properties.ips,
        Location: info.properties.location.toString()
    }
}

function printLan(info) {
    return {
        Id: info.id,
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
                if(info.items[i].properties.imageType == "HDD"){
                    dc.push(printImage(info.items[i]))
                }
                break
        }
    }
    printResults(type.capitalize() + 's', dc)
}

function printResults(title, value) {
    if (isJson)
        console.log(JSON.stringify(value))
    else
        console.table(title, value)
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}