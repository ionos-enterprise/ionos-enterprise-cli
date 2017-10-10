var pbclient = require('libprofitbricks')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processGroup

function processGroup(params) {
    switch (params.group) {
        case 'list':
            pbclient.listGroups(helpers.printInfo)
            break
        case 'get':
        case 'show':
            if (!params.id || params.id == true) {
                console.error("Group ID is a required field. -i [env]")
                process.exit(code = 5)
            }
            pbclient.getGroup(params.id, helpers.printInfo)
            break
        case 'create':
            createGroup(params)
            break
        case 'update':
            updateGroup(params)
            break
        case 'delete':
            if (!params.id || params.id == true) {
                console.error("Group ID is a required field. -i [env]")
                process.exit(code = 5)
            }

            if (!global.force) {
                pbclient.getGroup(params.id, function(error, response, body) {
                    if (response.statusCode > 299) {
                        console.log("Object you are trying to delete does not exist")

                    } else {
                        var info = JSON.parse(body)

                        console.log('You are about to delete "' + info.properties.name + '" Group. Do you want to proceed? (y/n)')
                        prompt.get(['yes'], function(err, result) {
                            if (result.yes == 'yes' || result.yes == 'y' || result.yes == '')
                                pbclient.deleteGroup(params.id, helpers.printInfo)
                            else
                                process.exit(code = 0)
                        })
                    }
                })
            } else
                pbclient.deleteGroup(params.id, helpers.printInfo)
            break
        case 'user':
            if (!params.id || params.id == true) {
                console.error("Group ID is a required field. -i [env]")
                process.exit(code = 5)
            }
            if (!params.adduser && !params.removeuser) {
                console.error("User ID is a required field. --adduser [env] | --removeuser [env]")
                process.exit(code = 5)
            }
            if (params.adduser) {
                user = {}
                user.id = params.adduser
                pbclient.addGroupUser(params.id, user, helpers.printInfo)
            } else
                pbclient.removeGroupUser(params.id, params.removeuser, helpers.printInfo)
            break
        case 'users':
            if (!params.id || params.id == true) {
                console.error("Group ID is a required field. -i [env]")
                process.exit(code = 5)
            }
            pbclient.listGroupUsers(params.id, helpers.printInfo)
            break
        default:
            params.outputHelp()
            break
    }
}

function createGroup(params) {
    var data = {}
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
            if (params.createdatacenter)
                data.properties.createDataCenter = params.createdatacenter
            if (params.createsnapshot)
                data.properties.createSnapshot = params.createsnapshot
            if (params.reserveip)
                data.properties.reserveIp = params.reserveip
            if (params.accessactlog)
                data.properties.accessActivityLog = params.accessactlog
        }
    } finally {
        pbclient.createGroup(data, helpers.printInfo)
    }
}

function updateGroup(params) {
    var data = {}

    if (!params.id) {
        console.error("Group Id is a required field.")
        process.exit(code = 5)
    }
    data.properties = {}
    if (params.name)
        data.properties.name = params.name
    else {
        console.error("Name is a required field.")
        process.exit(code = 5)
    }
    if (params.createdatacenter)
        data.properties.createDataCenter = params.createdatacenter
    if (params.createsnapshot)
        data.properties.createSnapshot = params.createsnapshot
    if (params.reserveip)
        data.properties.reserveIp = params.reserveip
    if (params.accessactlog)
        data.properties.accessActivityLog = params.accessactlog

    pbclient.updateGroup(params.id, data, helpers.printInfo)
}
