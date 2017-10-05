/**
 * Created by jasmin.gacic on 03/11/15.
 */

/**
 * Node v8.x now reserves the unused console.table namespace. Removing
 * the module allows CLI compatibility with Node v8.x.
 */
delete console.table
require('console.table')

var program = require('commander')
var pbclient = require('libprofitbricks')
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
var request = require('./features/request')
var location = require('./features/location')
var firewall = require('./features/firewall')
var group = require('./features/group')
var user = require('./features/user')
var share = require('./features/share')
var resource = require('./features/resource')

global.force = false

pbclient.setdepth(5)

initializeCli()

parseParameters()

function initializeCli() {
    program
        .version('4.0.0')
        .usage('[Options]')
        .option('setup', 'Configures credentials for ProfitBricks CLI')
        .option('datacenter, [env]', 'Data center operations')
        .option('server, [env]', 'Server operations')
        .option('volume, [env]', 'Volume operations')
        .option('snapshot, [env]', 'Snapshot operations')
        .option('loadbalancer, [env]', 'Load Balancer operations')
        .option('nic, [env]', 'NIC operations')
        .option('firewall, [env]', 'Firewall Rule operations')
        .option('ipblock, [env]', 'IP Block operations')
        .option('drives, [env]', 'CD ROM drive operations')
        .option('image, [env]', 'Image operations')
        .option('lan, [env]', 'LAN operations')
        .option('request, [env]', 'Request operations')
        .option('location, [env]', 'Location operations')
        .option('group, [env]', 'Group operations')
        .option('user, [env]', 'User operations')
        .option('share, [env]', 'Share operations')
        .option('resource, [env]', 'Resource operations')
        .option('-i, --id [env]', 'Id')
        .option('-n, --name [env]', 'Name')
        .option('-l, --location [env]', 'Location')
        .option('-d, --description [env]', 'Description')
        .option('-p, --path [env]', 'Path to JSON script')
        .option('--datacenterid [env]', 'DatacenterId')
        .option('--loadbalancerid [env]', 'LoadbalancerId')
        .option('-r, --ram [env]', 'Ram size in multiples of 256 MB')
        .option('-c, --cores [env]', 'Number of cores')
        .option('-a, --availabilityzone [env]', 'Availability Zone')
        .option('--licencetype [env]', 'Licence Type')
        .option('--sshkey [env]', 'SSH key')
        .option('--bootVolume [env]', 'Reference to a Volume used for booting')
        .option('--bootCdrom [env]', 'Reference to a CD-ROM used for booting.')
        .option('--volumeid [env]', 'Volume id')
        .option('--volumesize [env]', 'Volume size')
        .option('--volumename [env]', 'Volume name')
        .option('--imageid [env]', 'Image id')
        .option('--imagealias [env]', 'Image alias')
        .option('-b --bus [env]', 'Bus type (VIRTIO or IDE)')
        .option('-t --type [env]', 'The disk type.')
        .option('--imagepassword [env]', 'One-time password is set on the Image for the appropriate account. Password has to contain 8-50 characters. Only these characters are allowed: [abcdefghjkmnpqrstuvxABCDEFGHJKLMNPQRSTUVX23456789]')
        .option('-s, --size [env]', 'Size in GB')
        .option('--cpuHotPlug', 'Volume is capable of CPU hot plug (no reboot required)')
        .option('--cpuHotUnplug', 'Volume is capable of CPU hot unplug (no reboot required)')
        .option('--ramHotPlug', 'Volume is capable of memory hot plug (no reboot required)')
        .option('--ramHotUnplug', 'Volume is capable of memory hot unplug (no reboot required)')
        .option('--nicHotPlug', 'Volume is capable of NIC hot plug (no reboot required)')
        .option('--nicHotUnplug', 'Volume is capable of NIC hot unplug (no reboot required)')
        .option('--discVirtioHotPlug', 'Volume is capable of Virt-IO drive hot plug (no reboot required)')
        .option('--discVirtioHotUnplug', 'Volume is capable of Virt-IO drive hot unplug (no reboot required)')
        .option('--discScsiHotPlug', 'Volume is capable of SCSI drive hot plug (no reboot required)')
        .option('--discScsiHotUnplug', 'Volume is capable of SCSI drive hot unplug (no reboot required)')
        .option('--ip [env]', 'IPv4 address of the loadbalancer.')
        .option('--dhcp [env]', 'Indicates if the loadbalancer will reserve an IP using DHCP.')
        .option('--serverid [env]', 'Server id')
        .option('--cpufamily [env]', 'Sets the CPU type. "AMD_OPTERON" or "INTEL_XEON". Defaults to "AMD_OPTERON".')
        .option('--lan [env]', 'The LAN ID the NIC will sit on. If the LAN ID does not exist it will be created.')
        .option('--public [env]', 'Boolean indicating if the LAN faces the public Internet or not.')
        .option('--ipfailover [env]', 'IP failover group, e.g. "ip1,nicid1;ip2,nicid2;ip3,nicid3..."')
        .option('--requestid [env]', 'Request UUID')
        .option('--nicid [env]', 'Network Interface UUID')
        .option('--nat', 'NIC Network Address Translation')
        .option('--protocol [env]', 'The protocol for the rule: TCP, UDP, ICMP, ANY.')
        .option('--sourceMac [env]', 'Only traffic originating from the respective MAC address is allowed. Valid format: aa:bb:cc:dd:ee:ff. Value null allows all source MAC address.')
        .option('--sourceIp [env]', 'Only traffic originating from the respective IPv4 address is allowed. Value null allows all source IPs.')
        .option('--sourceIp [env]', 'Only traffic originating from the respective IPv4 address is allowed. Value null allows all source IPs.')
        .option('--targetIp [env]', 'In case the target NIC has multiple IP addresses, only traffic directed to the respective IP address of the NIC is allowed. Value null allows all target IPs.')
        .option('--targetIp [env]', 'In case the target NIC has multiple IP addresses, only traffic directed to the respective IP address of the NIC is allowed. Value null allows all target IPs.')
        .option('--portRangeStart [env]', 'Defines the start range of the allowed port (from 1 to 65534) if protocol TCP or UDP is chosen. Leave portRangeStart and portRangeEnd value null to allow all ports.')
        .option('--portRangeEnd [env]', 'Defines the end range of the allowed port (from 1 to 65534) if protocol TCP or UDP is chosen. Leave portRangeStart and portRangeEnd value null to allow all ports.')
        .option('--portRangeEnd [env]', 'Defines the end range of the allowed port (from 1 to 65534) if protocol TCP or UDP is chosen. Leave portRangeStart and portRangeEnd value null to allow all ports.')
        .option('--icmpType [env]', 'Defines the allowed type (from 0 to 254) if the protocol ICMP is chosen. Value null allows all types.')
        .option('--icmpCode [env]', 'Defines the allowed code (from 0 to 254) if protocol ICMP is chosen. Value null allows all codes.')
        .option('--groupid [env]', 'Group UUID')
        .option('--resourceid [env]', 'Resource UUID')
        .option('--resourcetype [env]', 'Resource type. "datacenter", "snapshot", "ipblock" or "image".')
        .option('--editprivilege [env]', 'The group has permission to edit privileges on the resource.')
        .option('--shareprivilege [env]', 'The group has permission to share the resource.')
        .option('--createdatacenter [env]', 'Group will be allowed to create virtual data centers.')
        .option('--createsnapshot [env]', 'Group will be allowed to create snapshots.')
        .option('--reserveip [env]', 'Group will be allowed to reserve IP addresses.')
        .option('--accessactlog [env]', 'Group will be allowed to access the activity log.')
        .option('--firstname [env]', 'A first name for the user.')
        .option('--lastname [env]', 'A last name for the user.')
        .option('--email [env]', 'An email for the user.')
        .option('--password [env]', 'A password for the user.')
        .option('--admin [env]', 'Indicates if the user has administrative rights.')
        .option('--forcesecauth [env]', 'Indicates if secure (two-factor) authentication should be forced for the user.')
        .option('--json', 'Print results as JSON string')
        .option('--addip [env]','Add IP')
        .option('--removeip [env]', 'Remove IP')
        .option('--adduser [env]', 'UUID of the user to add to a group')
        .option('--removeuser [env]', 'UUID of the user to remove from a group')
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

    prompt.get(schema, function (err, result) {
        pbclient.setauth(result.username, result.password   )
        pbclient.listDatacenters(function (error, response, body) {
            if (response && response.statusCode && response.statusCode == 200) {
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
    else if (program.firewall)
        firewall.process(program)
    else if (program.request)
        request.process(program)
    else if (program.group)
        group.process(program)
    else if (program.user)
        user.process(program)
    else if (program.share)
        share.process(program)
    else if (program.resource)
        resource.process(program)
    else if (program.location){
        location.process(program)
        }
    else
        program.outputHelp()
}
