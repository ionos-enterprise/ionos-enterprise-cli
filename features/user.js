var pbclient = require('libionosenterprise')
var prompt = require('prompt')
var helpers = require('../helpers')
var fs = require('fs')

exports.process = processUser

function processUser(params) {
    switch (params.user) {
        case 'list':
            pbclient.listUsers(helpers.printInfo)
            break
        case 'get':
        case 'show':
            if (!params.id || params.id == true) {
                console.error("User ID is a required field. -i [env]")
                process.exit(code = 5)
            }
            pbclient.getUser(params.id, helpers.printInfo)
            break
        case 'create':
            createUser(params)
            break
        case 'update':
            updateUser(params)
            break
        case 'delete':
            if (!params.id || params.id == true) {
                console.error("User ID is a required field. -i [env]")
                process.exit(code = 5)
            }

            if (!global.force) {
                pbclient.getUser(params.id, function(error, response, body) {
                    if (response.statusCode > 299) {
                        console.log("Object you are trying to delete does not exist")

                    } else {
                        var info = JSON.parse(body)

                        console.log('You are about to delete "' + info.properties.firstname + ' ' + info.properties.lastname + '" User. Do you want to proceed? (y/n)')
                        prompt.get(['yes'], function(err, result) {
                            if (result.yes == 'yes' || result.yes == 'y' || result.yes == '')
                                pbclient.deleteUser(params.id, helpers.printInfo)
                            else
                                process.exit(code = 0)
                        })
                    }
                })
            } else
                pbclient.deleteUser(params.id, helpers.printInfo)
            break
        default:
            params.outputHelp()
            break
    }
}

function createUser(params) {
    var data = {}
    try {
        if (params.path) {
            data = JSON.parse(fs.readFileSync(params.path, 'utf8'))
        } else {
            data.properties = {}
            if (params.firstname)
                data.properties.firstname = params.firstname
            else {
                console.error("First name is a required field.")
                process.exit(code = 5)
            }
            if (params.lastname)
                data.properties.lastname = params.lastname
            else {
                console.error("Last name is a required field.")
                process.exit(code = 5)
            }
            if (params.email)
                data.properties.email = params.email
            else {
                console.error("Email is a required field.")
                process.exit(code = 5)
            }
            if (params.password)
                data.properties.password = params.password
            else {
                console.error("Password is a required field.")
                process.exit(code = 5)
            }
            if (params.admin)
                data.properties.administrator = params.admin
            if (params.forcesecauth)
                data.properties.forceSecAuth = params.forcesecauth
        }
    } finally {
        pbclient.createUser(data, helpers.printInfo)
    }
}

function updateUser(params) {
    var data = {}

    if (!params.id || params.id == true) {
        console.error("User Id is a required field.")
        process.exit(code = 5)
    }
    data.properties = {}
    if (params.firstname)
        data.properties.firstname = params.firstname
    else {
        console.error("First name is a required field.")
        process.exit(code = 5)
    }
    if (params.lastname)
        data.properties.lastname = params.lastname
    else {
        console.error("Last name is a required field.")
        process.exit(code = 5)
    }
    if (params.email)
        data.properties.email = params.email
    else {
        console.error("Email is a required field.")
        process.exit(code = 5)
    }
    if (params.admin)
        data.properties.administrator = params.admin
    if (params.forcesecauth)
        data.properties.forceSecAuth = params.forcesecauth

    pbclient.updateUser(params.id, data, helpers.printInfo)
}
