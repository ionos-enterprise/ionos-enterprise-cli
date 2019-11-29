var pbclient = require('libionosenterprise')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processIpblock

function processIpblock(params) {
    switch (params.ipblock) {
        case 'list':
            pbclient.listIpblocks(helpers.printInfo)
            break
        case 'get':
        case 'show':
            if (!params.id || params.id == true) {
                console.error("IP Block ID is a required field. -i [env]")
                process.exit(code = 5)
            }
            pbclient.getIpblock(params.id, helpers.printInfo)
            break
        case 'create':
            createIpblock(params)
            break
        case 'delete':
            if (!params.id || params.id == true) {
                console.error("IP Block ID is a required field. -i [env]")
                process.exit(code = 5)
            }

            if (!global.force) {
                pbclient.getIpblock(params.id, function(error, response, body) {
                    if (response.statusCode > 299) {
                        console.log("Object you are trying to delete does not exist")

                    } else {
                        var info = JSON.parse(body)

                        console.log('You are about to delete "' + info.properties.name + '" IP Block. Do you want to proceed? (y/n)')
                        prompt.get(['yes'], function(err, result) {
                            if (result.yes == 'yes' || result.yes == 'y' || result.yes == '')
                                pbclient.releaseIpblock(params.id, helpers.printInfo)
                            else
                                process.exit(code = 0)
                        })
                    }
                })
            } else
                pbclient.releaseIpblock(params.id, helpers.printInfo)
            break
        default:
            params.outputHelp()
            break
    }
}

function createIpblock(params) {
    var data = {}
    try {
        if (params.path) {
            data = JSON.parse(fs.readFileSync(params.path, 'utf8'))
        } else {
            data.properties = {}
            if (params.location)
                data.properties.location = params.location
            else {
                console.error("Location is a required field.")
                process.exit(code = 5)
            }
            if (params.size)
                data.properties.size = params.size
            else {
                console.error("Size is a required field.")
                process.exit(code = 5)
            }

            data.properties.name = params.name
        }
    } finally {
        pbclient.reserveIpblock(data, helpers.printInfo)
    }
}
