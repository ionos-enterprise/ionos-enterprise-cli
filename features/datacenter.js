var pbclient = require('libprofitbricks')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')
require('console.table')

exports.process = processDataCenter


function processDataCenter(params) {

    switch (params.datacenter) {
        case 'list':
            pbclient.listDatacenters(helpers.printInfo)
            break
        case 'get':
        case 'show':
            if (!params.id || params.id == true) {
                console.error('Please provide Data Center Id -i [dcid]')
                process.exit(code = 5)
            }
            pbclient.getDatacenter(params.id, helpers.printInfo)
            break
        case 'create':
            createDataCenter(params)
            break
        case 'update':
            updateDataCenter(params)
            break
        case 'delete':
            if (!global.force) {
                console.log('You are about to delete a data center. Do you want to proceed? (y/n')
                prompt.get(['yes'], function (err, result) {
                    console.log(result.yes)
                    if (result.yes == 'yes' || result.yes == 'y')
                        pbclient.deleteDatacenter(params.id, helpers.printInfo)
                    else
                        process.exit(code = 0)
                })
            } else
                pbclient.deleteDatacenter(params.id, helpers.printInfo)

            break
        default:
            params.outputHelp()
            break
    }
}

function createDataCenter(params) {
    var data = {}
    try {
        if (params.path) {
            data = JSON.parse(fs.readFileSync(params.path, 'utf8'))
        } else {
            data.properties = {}
            if (params.name)
                data.properties.name = params.name
            else {
                console.log("Name is a required field.")
                console.log("Exiting...")
                return
            }
            if (params.location)
                data.properties.location = params.location
            else {
                console.log("Location is a required field.")
                console.log("Exiting...")
                return
            }

            data.properties.description = params.description
        }
    }
    catch (err) {
        console.error(err)
        process.exit(5)
    }
    finally {
        pbclient.createDatacenter(data, helpers.printInfo)
    }
}

function updateDataCenter(params) {
    var data = {}
    if (!params.id || params.id == true) {
        console.error("Data Center Id is a required field.")
        process.exit(code = 5)
    }

    if (params.name)
        data.name = params.name
    if (params.description)
        data.description = params.description

    pbclient.patchDatacenter(params.id, data, helpers.printInfo)
}