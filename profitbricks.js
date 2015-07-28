/**
 * Created by jasmin.gacic on 03/11/15.
 */

var program = require('commander')
var pbclient = require('libprofitbricks')
require('console.table')
var helpers = require('./helpers')
var fs = require('fs')
var prompt = require('prompt')
var datacenter = require('./features/datacenter')
var server = require('./features/server')
var volume = require('./features/volume')
var snapshot = require('./features/snapshot')
var loadbalancer = require('./features/loadbalancer')
var nic = require('./features/nic')
var ipblock = require('./features/ipblock')
var lan = require('./features/lan')
var drives = require('./features/drive')
var images = require('./features/image')
global.force = false

pbclient.setdepth(5)

initializeCli()

parseParameters()

function initializeCli() {
    program
        .version('0.0.1')
        .usage('[Options]')
        .option('setup', 'Configures user information for profitbricks CLI')
        .option('datacenter, [env]', 'Data center operations')
        .option('server, [env]', 'Server operations')
        .option('volume, [env]', 'Volume operations')
        .option('snapshot, [env]', 'Snapshot operations')
        .option('loadbalancer, [env]', 'Load Balancer operations')
        .option('nic, [env]', 'NIC operations')
        .option('ipblock, [env]', 'IP Block operations')
        .option('drives, [env]', 'CD ROM drives operations')
        .option('image [env]', 'Image operations')
        .option('lan [env]', 'LAN operations')
        .option('-i, --id [env]', 'id parameter')
        .option('-n, --name [env]', 'Name parameter')
        .option('-l, --location [env]', 'location parameter')
        .option('-d, --description [env]', 'description parameter')
        .option('-p, --path [env]', 'Path to json script')
        .option('--datacenterid [env]', 'DatacenterId parameter')
        .option('-r, --ram [env]', 'ram size')
        .option('-c, --cores [env]', 'nr of cores')
        .option('-a, --availabilityzone [env]', 'AvailabilityZone')
        .option('--licencetype [env]', 'Licence Type')
        .option('--bootVolume', 'Reference to a Volume used for booting')
        .option('--bootCdrom', 'Reference to a CD-ROM used for booting.')
        .option('--volumeid [env]', 'volume id')
        .option('--volumesize [env]', 'volume size')
        .option('--volumename [env]', 'volume name')
        .option('--imageid [env]', 'image id')
        .option('-b --bus [env]', 'bus')
        .option('-s, --size [env]', 'size parameter')
        .option('--cpuHotPlug', 'This volume is capable of CPU hot plug (no reboot required)')
        .option('--cpuHotUnplug', 'This volume is capable of CPU hot unplug (no reboot required)')
        .option('--ramHotPlug', 'This volume is capable of memory hot plug (no reboot required)')
        .option('--ramHotUnplug', 'This volume is capable of memory hot unplug (no reboot required)')
        .option('--nicHotPlug', 'This volume is capable of nic hot plug (no reboot required)')
        .option('--nicHotUnplug', 'This volume is capable of nic hot unplug (no reboot required)')
        .option('--discVirtioHotPlug', 'This volume is capable of Virt-IO drive hot plug (no reboot required)')
        .option('--discVirtioHotUnplug', 'This volume is capable of Virt-IO drive hot unplug (no reboot required)')
        .option('--discScsiHotPlug', 'This volume is capable of Scsi drive hot plug (no reboot required)')
        .option('--discScsiHotUnplug', 'This volume is capable of Scsi drive hot unplug (no reboot required)')
        .option('--ip [env]', 'IPv4 address of the loadbalancer.')
        .option('--dhcp', 'Indicates if the loadbalancer will reserve an IP using DHCP.')
        .option('--serverid [env]', 'Server id')
        .option('--lan [env]', 'The LAN ID the NIC will sit on. If the LAN ID does not exist it will be created.')
        .option('--public', 'Boolean indicating if the LAN faces the public Internet or not.')
        .option('--json', 'Print results as JSON string')
        .option('-f, --force', 'Forces execution')
        .parse(process.argv)
}

function authenticate() {
    prompt.start()

    var schema = {
        properties: {
            username: {
                required: true
            },
            password: {
                hidden: true
            }
        }
    }

    prompt.get(schema, function(err, result) {
        pbclient.setauth(result.username, result.password)
        pbclient.listDatacenters(function(error, response, body) {
            if (response.statusCode == 200) {
                helpers.toBase64(result.username, result.password)
            } else {
                console.error('Invalid user name or password. Please try again!')
                process.exit(code = 5)
            }
        })
        helpers.toBase64(result.username, result.password)
    })
}


function parseParameters() {
    if (!process.argv.slice(2).length) {
        program.outputHelp()
        return
    }

    if (program.json)
        helpers.setJson(program.json)
    if (program.force)
        global.force = program.force

    try {
        var authdata = helpers.getAuthData()
        pbclient.pbauth(authdata)
    } catch (err) {
        console.log("Please run 'profitbricks setup' to set up your authentication data.")
        process.exit(code = 0)
    }

    if (program.setup)
        authenticate()

    else if (program.datacenter)
        datacenter.process(program)
    else if (program.server)
        server.process(program)
    else if (program.volume)
        volume.process(program)
    else if (program.snapshot)
        snapshot.process(program)
    else if (program.loadbalancer)
        loadbalancer.process(program)
    else if (program.nic)
        nic.process(program)
    else if (program.ipblock)
        ipblock.process(program)
    else if (program.lan)
        lan.process(program)
    else if (program.drives)
        drives.process(program)
    else if (program.image)
        images.process(program)
    else
        program.outputHelp()        
}