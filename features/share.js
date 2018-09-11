var pbclient = require('libprofitbricks')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processShare

function processShare(params) {
    if (!params.groupid || params.groupid == true) {
        console.error("Group ID is a required field. --groupid [env]")
        process.exit(code = 5)
    }
    switch (params.share) {
        case 'list':
            pbclient.listShares(params.groupid, helpers.printInfo)
            break
        case 'get':
        case 'show':
            if (!params.id || params.id == true) {
                console.error("Share ID is a required field. -i [env]")
                process.exit(code = 5)
            }
            pbclient.getShare(params.groupid, params.id, helpers.printInfo)
            break
        case 'add':
        case 'create':
            addShare(params)
            break
        case 'update':
            updateShare(params)
            break
        case 'delete':
        case 'remove':
            if (!params.id || params.id == true) {
                console.error("Share ID is a required field. -i [env]")
                process.exit(code = 5)
            }

            if (!global.force) {
                pbclient.getShare(params.groupid, params.id, function(error, response, body) {
                    if (response.statusCode > 299) {
                        console.log("Resource you are trying to unshare does not exist")

                    } else {
                        var info = JSON.parse(body)

                        console.log('You are about to unshare "' + info.id + '" Resource. Do you want to proceed? (y/n)')
                        prompt.get(['yes'], function(err, result) {
                            if (result.yes == 'yes' || result.yes == 'y' || result.yes == '')
                                pbclient.removeShare(params.groupid, params.id, helpers.printInfo)
                            else
                                process.exit(code = 0)
                        })
                    }
                })
            } else
                pbclient.removeShare(params.groupid, params.id, helpers.printInfo)
            break
        default:
            params.outputHelp()
            break
    }
}

function addShare(params) {
    var data = {}
    data.properties = {}
    if (!params.resourceid || params.resourceid == true) {
        console.error("ID of the resource to share is a required field. --resourceid [env]")
        process.exit(code = 5)
    }
    if (params.editprivilege)
        data.properties.editPrivilege = params.editprivilege
    if (params.shareprivilege)
        data.properties.sharePrivilege = params.shareprivilege

    pbclient.addShare(params.groupid, params.resourceid, data, helpers.printInfo)
}

function updateShare(params) {
    if (!params.id || params.id == true) {
        console.error("Share ID is a required field. -i [env]")
        process.exit(code = 5)
    }
    var data = {}
    data.properties = {}
    if (params.editprivilege)
        data.properties.editPrivilege = params.editprivilege
    if (params.shareprivilege)
        data.properties.sharePrivilege = params.shareprivilege

    pbclient.updateShare(params.groupid, params.id, data, helpers.printInfo)
}
