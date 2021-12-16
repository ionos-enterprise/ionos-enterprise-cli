[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)
# DEPRECATED

This is no longer supported, please consider using [IONOS Cloud CLI](https://github.com/ionos-cloud/ionosctl) instead.

# IonosEnterprise CLI

# Table of Contents

* [Concepts](#concepts)
* [Getting Started](#getting-started)
* [Installation](#installation)
* [Overview](#overview)
* [How To:](#how-tos)
    * [Create Data Center](#create-data-center)
    * [Create Server](#create-server)
    * [Update Server](#update-server)
    * [List Servers](#list-servers)
    * [Create Volume](#create-volume)
    * [Attach Volume](#attach-volume)
    * [List Volumes](#list-volumes)
    * [Create Snapshot](#create-snapshot)
    * [List Snapshots](#list-snapshots)
    * [Update Snapshot](#update-snapshot)
    * [Delete Snapshot](#delete-snapshot)
* [Reference](#reference)
    * [Data Center](#data-center)
    * [Server](#server)
    * [Volume](#volume)
    * [Snapshot](#snapshot)
    * [Load Balancer](#load-balancer)
    * [Image](#image)
    * [NIC](#nic)
    * [Firewall Rules](#firewall)
    * [IP Block](#ip-block)
    * [LAN](#lan)
    * [User](#user)
    * [Group](#group)
    * [Share](#share)
    * [Resource](#resource)
    * [Contract Resources](#contract-resources)
* [Support](#support)

## Concepts

The IonosEnterprise CLI wraps the [IonosEnterprise Cloud API](https://devops.ionos.com/api/cloud/v5/) allowing you to interact with it from a command-line interface.

## Getting Started

Before you begin you will need to have [signed-up](https://www.ionos.com/enterprise-cloud/signup) for a IonosEnterprise account. The credentials you establish during sign-up will be used to authenticate against the [IonosEnterprise Cloud API](https://devops.ionos.com/api/cloud/v5/).

## Installation

Please utilize one of the following URL's to retrieve an install script that is appropriate for your environment.

### Linux

[GitHub - IonosEnterprise Linux Install](https://github.com/ionos-enterprise/ionos-enterprise-cli/tree/master/install/linux/install.sh)

### Mac

[GitHub - IonosEnterprise Mac Install](https://github.com/ionos-enterprise/ionos-enterprise-cli/tree/master/install/mac/install.sh)

### Windows

[GitHub - IonosEnterprise Windows Install](https://github.com/ionos-enterprise/ionos-enterprise-cli/tree/master/install/windows/install.bat)

If you prefer, you may install `nodejs` and `npm` manually. Then run the following to install the IonosEnterprise CLI module globally:

```
npm install -g ionosenterprise-cli
```

## Overview

A list of available operations can be accessed directly from the command line.

Run `ionosenterprise` or `ionosenterprise -h` or `ionosenterprise --help`:

```
  Usage: ionosenterprise [Options]


  Options:

    -V, --version                 output the version number
    setup                         Configures credentials for IonosEnterprise CLI
    datacenter, [env]             Data center operations
    server, [env]                 Server operations
    volume, [env]                 Volume operations
    snapshot, [env]               Snapshot operations
    loadbalancer, [env]           Load Balancer operations
    nic, [env]                    NIC operations
    firewall, [env]               Firewall Rule operations
    ipblock, [env]                IP Block operations
    drives, [env]                 CD ROM drive operations
    image, [env]                  Image operations
    lan, [env]                    LAN operations
    request, [env]                Request operations
    location, [env]               Location operations
    contract, [env]               Contract resources operations
    group, [env]                  Group operations
    user, [env]                   User operations
    share, [env]                  Share operations
    resource, [env]               Resource operations
    -i, --id [env]                Id
    -n, --name [env]              Name
    -l, --location [env]          Location
    -d, --description [env]       Description
    -p, --path [env]              Path to JSON script
    --datacenterid [env]          DatacenterId
    --loadbalancerid [env]        LoadbalancerId
    -r, --ram [env]               Ram size in multiples of 256 MB
    -c, --cores [env]             Number of cores
    -a, --availabilityzone [env]  Availability Zone
    --licencetype [env]           Licence Type
    --sshkey [env]                SSH key
    --bootVolume [env]            Reference to a Volume used for booting
    --bootCdrom [env]             Reference to a CD-ROM used for booting.
    --volumeid [env]              Volume id
    --volumesize [env]            Volume size
    --volumename [env]            Volume name
    --imageid [env]               Image id
    --imagealias [env]            Image alias
    -b --bus [env]                Bus type (VIRTIO or IDE)
    -t --type [env]               The disk type.
    --imagepassword [env]         One-time password is set on the Image for the appropriate account. Password has to contain 8-50 characters. Only these characters are allowed: [abcdefghjkmnpqrstuvxABCDEFGHJKLMNPQRSTUVX23456789]
    -s, --size [env]              Size in GB
    --cpuHotPlug                  Volume is capable of CPU hot plug (no reboot required)
    --cpuHotUnplug                Volume is capable of CPU hot unplug (no reboot required)
    --ramHotPlug                  Volume is capable of memory hot plug (no reboot required)
    --ramHotUnplug                Volume is capable of memory hot unplug (no reboot required)
    --nicHotPlug                  Volume is capable of NIC hot plug (no reboot required)
    --nicHotUnplug                Volume is capable of NIC hot unplug (no reboot required)
    --discVirtioHotPlug           Volume is capable of Virt-IO drive hot plug (no reboot required)
    --discVirtioHotUnplug         Volume is capable of Virt-IO drive hot unplug (no reboot required)
    --discScsiHotPlug             Volume is capable of SCSI drive hot plug (no reboot required)
    --discScsiHotUnplug           Volume is capable of SCSI drive hot unplug (no reboot required)
    --ip [env]                    IPv4 address of the loadbalancer.
    --dhcp [env]                  Indicates if the loadbalancer will reserve an IP using DHCP.
    --serverid [env]              Server id
    --cpufamily [env]             Sets the CPU type. "AMD_OPTERON" or "INTEL_XEON". Defaults to "AMD_OPTERON".
    --lan [env]                   The LAN ID the NIC will sit on. If the LAN ID does not exist it will be created.
    --public [env]                Boolean indicating if the LAN faces the public Internet or not.
    --ipfailover [env]            IP failover group, e.g. "ip1,nicid1;ip2,nicid2;ip3,nicid3..."
    --requestid [env]             Request UUID
    --nicid [env]                 Network Interface UUID
    --nat                         NIC Network Address Translation
    --protocol [env]              The protocol for the rule: TCP, UDP, ICMP, ANY.
    --sourceMac [env]             Only traffic originating from the respective MAC address is allowed. Valid format: aa:bb:cc:dd:ee:ff. Value null allows all source MAC address.
    --sourceIp [env]              Only traffic originating from the respective IPv4 address is allowed. Value null allows all source IPs.
    --sourceIp [env]              Only traffic originating from the respective IPv4 address is allowed. Value null allows all source IPs.
    --targetIp [env]              In case the target NIC has multiple IP addresses, only traffic directed to the respective IP address of the NIC is allowed. Value null allows all target IPs.
    --targetIp [env]              In case the target NIC has multiple IP addresses, only traffic directed to the respective IP address of the NIC is allowed. Value null allows all target IPs.
    --portRangeStart [env]        Defines the start range of the allowed port (from 1 to 65534) if protocol TCP or UDP is chosen. Leave portRangeStart and portRangeEnd value null to allow all ports.
    --portRangeEnd [env]          Defines the end range of the allowed port (from 1 to 65534) if protocol TCP or UDP is chosen. Leave portRangeStart and portRangeEnd value null to allow all ports.
    --portRangeEnd [env]          Defines the end range of the allowed port (from 1 to 65534) if protocol TCP or UDP is chosen. Leave portRangeStart and portRangeEnd value null to allow all ports.
    --icmpType [env]              Defines the allowed type (from 0 to 254) if the protocol ICMP is chosen. Value null allows all types.
    --icmpCode [env]              Defines the allowed code (from 0 to 254) if protocol ICMP is chosen. Value null allows all codes.
    --groupid [env]               Group UUID
    --resourceid [env]            Resource UUID
    --resourcetype [env]          Resource type. "datacenter", "snapshot", "ipblock" or "image".
    --editprivilege [env]         The group has permission to edit privileges on the resource.
    --shareprivilege [env]        The group has permission to share the resource.
    --createdatacenter [env]      Group will be allowed to create virtual data centers.
    --createsnapshot [env]        Group will be allowed to create snapshots.
    --reserveip [env]             Group will be allowed to reserve IP addresses.
    --accessactlog [env]          Group will be allowed to access the activity log.
    --firstname [env]             A first name for the user.
    --lastname [env]              A last name for the user.
    --email [env]                 An email for the user.
    --password [env]              A password for the user.
    --admin [env]                 Indicates if the user has administrative rights.
    --forcesecauth [env]          Indicates if secure (two-factor) authentication should be forced for the user.
    --json                        Print results as JSON string
    --addip [env]                 Add IP
    --removeip [env]              Remove IP
    --adduser [env]               UUID of the user to add to a group
    --removeuser [env]            UUID of the user to remove from a group
    --ctresource [env]            Contract resources type [cores|ram|hdd|ssd|ips]
    -f, --force                   Forces execution
    -h, --help                    output usage information
```

## Configuration

Before using the CLI to perform any operations, we'll need to set our credentials:

```
$ ionosenterprise setup
>prompt: username:username
>prompt: password:
```

You will be notified with the following message if you have provided incorrect credentials:

```
>Invalid user name or password. Please try again!
```

After successful authentication you will no longer need to provide credentials unless you want to change them. They are stored as a BASE64 encoded string in a '.ionosenterprise-auth' file in your home directory.

You may provide your credentials in the environment variables as well. The CLI will always check for the credentials in the environment variables before attempting to read `.ionosenterprise-auth` file.

```
export IONOSENTERPRISE_USERNAME="YourIonosEnterpriseUsername"
export IONOSENTERPRISE_PASSWORD="YourIonosEnterprisePassword"
```

# How To's:

These examples assume that you don't have any resources provisioned under your account. The first thing we will want to do is create a data center to hold all of our resources.

## Create Data Center

We need to supply some parameters to get our first data center created. In this case, we will set the location to 'us/las'. Other valid locations can be determined by reviewing the [Cloud API Documentation](https://devops.ionos.com/api/cloud/v5/#locations). That documentation is an excellent resource since that is what the IonosEnterprise CLI is calling to complete these operations.

```
$ ionosenterprise datacenter create --name "Demo" --description "CLI Demo Data Center" --location "us/las"

Datacenter
-----------------------------------------------------
Id                                    Name  Location
------------------------------------  ----  ---------
3fc832b1-558f-48a4-bca2-af5043975393  Demo  us/las

RequestID: 45dbf0ba-fc1b-4a2c-855f-a11705a996b8
```

Et voilà, we've successfully provisioned a data center. Notice the "Id" that was returned. That UUID was assigned to our new data center and will be needed for other operations. The "RequestID" that was returned can be used to check on the status of any `create` or `update` operations.

```
$ ionosenterprise request get -i 45dbf0ba-fc1b-4a2c-855f-a11705a996b8

Status: DONE
Message: Request has been successfully executed
```

## Create Server

Next we'll create a server in the data center. This time we have to pass the 'Id' for the data center in, along with some other relevant properties (processor cores, memory, boot volume or boot CD-ROM) for the new server.

```
$ ionosenterprise server create --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393 --cores 2 --name "Demo Server" --ram 256 --cpufamily AMD_OPTERON

Server
------------------------------------------------------------------------------------------
Id                                    Name         AvailabilityZone  State  Cores  Memory
------------------------------------  -----------  -----------------  -----  -----  ------
03334965-466b-470a-8fe5-6d6e461402a5  Demo Server  null               BUSY   2      256RAM
```

## Update Server

Whoops, we didn't assign enough memory to our instance. Lets go ahead and update the server to increase the amount of memory it has assigned. We'll need the datacenterid, the id of the server we are updating, along with the parameters that we want to change.

```
$ ionosenterprise server update --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393 -i 11767ba1-6290-420f-a0bf-b77679a285b2 --cores 1 --name "Demo Server" --ram 1024

Server
-------------------------------------------------------------------------------------------
Id                                    Name         Availability Zone  State  Cores  Memory
------------------------------------  -----------  -----------------  -----  -----  -------
03334965-466b-470a-8fe5-6d6e461402a5  Demo Server  AUTO               BUSY   1      1024RAM
```

## List Servers

Lets take a look at the list of servers in our data center. There are a couple more listed in here for demonstration purposes.

```
$ ionosenterprise server list --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393

Servers
-----------------------------------------------------------------------------------------------
Id                                    Name         Availability Zone  State      Cores  Memory
------------------------------------  -----------  -----------------  ---------  -----  -------
11767ba1-6290-420f-a0bf-b77679a285b2  Demo Srvr 3  AUTO               AVAILABLE  1      1024RAM
9126cef1-d310-4b4c-953f-eb37a55beea4  Demo Srvr 2  AUTO               INACTIVE   1      1024RAM
5a8b18b1-7ba9-4139-9811-6232673a23db  Demo Srvr 1  AUTO               AVAILABLE  2      1024RAM
```

## Create Volume

Now that we have a server provisioned, it needs some storage. We'll specify a size for this storage volume in GB as well as set the 'bus' and 'licencetype'. The 'bus' setting can have a serious performance impact and you'll want to use VIRTIO when possible. Using VIRTIO may require drivers to be installed depending on the OS you plan to install. The 'licencetype' impacts billing rate, as there is a surcharge for running certain OS types.

```
$ ionosenterprise volume create --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393 --size 12 --bus VIRTIO --licencetype LINUX --type HDD --name "Demo Srvr 1 Boot" --sshkey [ssh_key_string] --availabilityzone [availability_zone]

Volume
------------------------------------------------------------------------
Id                                    Name  Size  Licence  Bus     State
------------------------------------  ----  ----  -------  ------  -----
d7dc58a1-9505-48f5-9db4-22cff0659cf8  null  12    LINUX    VIRTIO  BUSY
```

We can also use image aliases instead of non-constant image IDs to create new volumes. Use `image aliases` command to find out available image aliases for a particular location.

```
node ionosenterprise volume create --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393 --name "Test Alias" --imagealias ubuntu:latest --size 20 --bus VIRTIO --type SSD --sshkey [ssh_key_string]

Volume
------------------------------------------------------------------------------
Id                                    Name        Size  Licence  Bus     State
------------------------------------  ----------  ----  -------  ------  -----
e7a6e51e-824f-4733-8ae2-30da817a9cbe  Test Alias  20GB  null     VIRTIO  BUSY
```

## Attach Volume

The volume we've created is not yet connected or attached to a server. To accomplish that we'll use the `dcid` and `serverid` values returned from the previous commands:

```
$ ionosenterprise volume attach --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393 --serverid 03334965-466b-470a-8fe5-6d6e461402a5 -i d7dc58a1-9505-48f5-9db4-22cff0659cf8

Volume
----------------------------------------------------------------------------------
Id                                    Name              Size  Licence  Bus   State
------------------------------------  ----------------  ----  -------  ----  -----
d7dc58a1-9505-48f5-9db4-22cff0659cf8  Demo Srvr 1 Boot  12    LINUX    null  BUSY
```

## List Volumes

Let's take a look at all the volumes in the data center:

```
$ ionosenterprise volume list --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393

Volumes
----------------------------------------------------------------------------------------
Id                                    Name              Size  Licence  Bus     State
------------------------------------  ----------------  ----  -------  ------  ---------
d231cd2e-89c1-4ed4-b4ad-d0a2c8b2b4a7  Demo Srvr 1 Boot  10    LINUX    VIRTIO  AVAILABLE
53ff2942-b28e-4759-8bd9-8eb2a3533ab4  Demo Srvr 2 Boot  12    LINUX    VIRTIO  AVAILABLE
```

## Create Snapshot

If we have a volume we'd like to keep a copy of, perhaps as a backup, we can take a snapshot:

```
$ ionosenterprise snapshot create --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393 --volumeid d231cd2e-89c1-4ed4-b4ad-d0a2c8b2b4a7

Snapshot
-------------------------------------------------------------------------------------------------------------
Id                                    Name                                  Size  Created               State
------------------------------------  ------------------------------------  ----  --------------------  -----
cf90b2e3-179b-4bff-a84c-d53ca58487dd  Demo Srvr 1 Boot-Snapshot-07/27/2015  null  2015-07-27T17:41:41Z  BUSY
```

## List Snapshots

Here is a list of the snapshots in our account:

```
$ ionosenterprise snapshot list

Snapshots
-----------------------------------------------------------------------------------------------------------------
Id                                    Name                                  Size  Created               State
------------------------------------  ------------------------------------  ----  --------------------  ---------
cf90b2e3-179b-4bff-a84c-d53ca58487dd  Demo Srvr 1 Boot-Snapshot-07/27/2015  10    2015-07-27T17:41:42Z  AVAILABLE
```

## Update Snapshot

Now that we have a snapshot created, we can change the name to something more descriptive:

```
$ ionosenterprise snapshot update -i cf90b2e3-179b-4bff-a84c-d53ca58487dd --name "Demo Srvr 1 OS just installed"

Snapshot
------------------------------------------------------------------------------------------------------
Id                                    Name                           Size  Created               State
------------------------------------  -----------------------------  ----  --------------------  -----
cf90b2e3-179b-4bff-a84c-d53ca58487dd  Demo Srvr 1 OS just installed  10    2015-07-27T17:41:42Z  BUSY
```

## Delete Snapshot

We can delete our snapshot when we are done with it:

```
$ ionosenterprise snapshot delete -i cf90b2e3-179b-4bff-a84c-d53ca58487dd

You are about to delete a snapshot. Do you want to proceed? (y/n
prompt: yes:  y
```

## Summary

Now we've had a taste of working with the IonosEnterprise CLI. The reference section below will provide some additional information regarding what parameters are available for various operations.

# Reference

## Data Center

### List Data Centers

```
$ ionosenterprise datacenter list
```

### Get Specfic Data Center

```
$ ionosenterprise datacenter get -i [dcid]
$ ionosenterprise datacenter show -i [dcid]
```

### Create Data Center

```
$ ionosenterprise datacenter create -p [path_to_json]

$ ionosenterprise datacenter create --name [name] --description [text] --location [location]
```

### Update Data Center

```
$ ionosenterprise datacenter update -i [dcid] --name [name] --description [text]
```

### Delete Data Center

```
$ ionosenterprise datacenter delete -i [dcid]
```

## Server

### List Servers

```
$ ionosenterprise server list --datacenterid [dcid]
```

### Get Specific Server

```
$ ionosenterprise server show --datacenterid [dcid] -i [serverid]
```

### Create Server

```
$ ionosenterprise server create --datacenterid [dcid] --cores [cores] --name [name] --ram [ram] --cpufamily [cpu_type] --volumeid [preexisting_volume_id]

$ ionosenterprise server create --datacenterid [dcid] -p [path_to_json]
```

### Update Server

```
$ ionosenterprise server update --datacenterid [dcid] -i [serverid] --cores [cores] --name [name] --ram [ram]
```

### Delete Server

```
$ ionosenterprise server delete --datacenterid [dcid] -i [serverid]
```

### Start Server

```
$ ionosenterprise server start --datacenterid [dcid] -i [serverid]
```

### Stop Server

```
$ ionosenterprise server stop --datacenterid [dcid] -i [serverid]
```

### Reboot Server

```
$ ionosenterprise server reboot --datacenterid [dcid] -i [serverid]
```

## Volume

### List Volumes

```
$ ionosenterprise volume list --datacenterid [dcid]
```

### Get Specific Volume

```
$ ionosenterprise volume show --datacenterid [dcid] -i [volumeid]
```

### Create Volume

```
$ ionosenterprise volume create --datacenterid [dcid] -p [path_to_json]

$ ionosenterprise volume create --datacenterid  [dcid] --name [name] --size [size] --bus [bus] --type [HDD/SSD] -availabilityzone [AUTO,ZONE_1,ZONE_2,ZONE_3]
```

### Attach Volume

```
$ ionosenterprise volume attach --datacenterid [dcid] --serverid [serverid] -i [volumeid]
```

### Detach Volume

```
$ ionosenterprise volume detach --datacenterid [dcid] --serverid [serverid] -i [volumeid]
```

### Update Volume

```
$ ionosenterprise volume update -i [id] --datacenterid [dcid] --name [name]
```

### Delete Volume

```
$ ionosenterprise volume delete --datacenterid [dcid] -i [volumeid]
```

## Snapshot

### List Snapshots

```
$ ionosenterprise snapshot list
```

### Create Snapshot

```
$ ionosenterprise snapshot create --datacenterid [dcid] --volumeid [volumeid] --name [name] --description [description]
```

### Restore Snapshot

```
$ ionosenterprise snapshot restore -i [snapshotid] --datacenterid [dcid] --volumeid [volumeid]
```

### Update Snapshot

```
$ ionosenterprise snapshot update -i [snapshotid] --name [name]
```

### Delete Snapshot

```
$ ionosenterprise snapshot delete -i [snapshotid]
```

## Load Balancer

### List Load Balancers

```
$ ionosenterprise loadbalancer list --datacenterid [dcid]
```

### Get Specific Load Balancer

```
$ ionosenterprise loadbalancer show --datacenterid [dcid] -i [loadbalancerid]
```

### Create Load Balancer

```
$ ionosenterprise loadbalancer create --datacenterid [dcid] --name  [name] --ip [ip] --dhcp [true|false]

$ ionosenterprise loadbalancer create --datacenterid [dcid] -p [path_to_json]
```

### Update Load Balancer

```
$ ionosenterprise loadbalancer update -i [loadbalancerid] --datacenterid [dcid] --name [name]
```

### Delete Load Balancer

```
$ ionosenterprise loadbalancer delete -i [loadbalancerid] --datacenterid [dcid]
```

## Image

### List Images

```
$ ionosenterprise image list
```

### Get Specific Image

```
$ ionosenterprise image show -i [imageid]
```

### Update Image

```
$ ionosenterprise image update -i [imageid] --name [name] ---description [description] --licencetype [licencetype]
```

### Delete Image

```
$ ionosenterprise image delete -i [imageid]
```

### List Image Aliases

```
$ ionosenterprise image aliases -l [locationid]
```

## NIC

### List NICs

```
$ ionosenterprise nic list --datacenterid [dcid] --serverid [serverid]
```

### Get Specific NIC

```
$ ionosenterprise nic get --datacenterid [dcid] --serverid [serverid] -i [nicid]
```

### Create NIC

```
$ ionosenterprise nic create --datacenterid [dcid]--serverid [serverid] -p [path_to_json]

$ ionosenterprise nic create --datacenterid [dcid] --serverid [serverid] --name [name] --ip [ip] --dhcp [true|false] --lan [lan] --nat [true/false]
```

### Update NIC

```
$ ionosenterprise nic update -i [nicid] --datacenterid [dcid] --serverid [serverid] --name [name] --ip [ip] --dhcp [true|false] --lan [lan]
$ ionosenterprise nic update --datacenterid [dc] --serverid [server] -i [nicid] --addip 1.1.1.1
$ ionosenterprise nic update --datacenterid [dc] --serverid [server] -i [nicid] --removeip 1.1.1.1
```


### Delete NIC

```
$ ionosenterprise nic delete -i [nicid] --datacenterid [dcid] --serverid [serverid]
```

### List Load Balanced NIC

```
$ ionosenterprise nic list --datacenterid [dcid] --loadbalancerid [lbid]
```

### Attach a NIC to a Load Balancer

```
$ ionosenterprise nic attach --datacenterid [dcid] --loadbalancerid [lbid] -i [nicid]
```

### Detach a NIC from a Load Balancer

```
$ ionosenterprise nic detach --datacenterid [dcid] --loadbalancerid [lbid] -i [nicid]
```

## Firewall Rules

### List Firewall Rules

```
$ionosenterprise firewall list --datacenterid [dcid] --serverid [serverid] --nicid [nicid]
```

### Get Specific Firewall Rule

```
$ionosenterprise firewall get --datacenterid [dcid] --serverid [serverid] --nicid [nicid] --id [firewallid]
```

### Create Firewall Rules

```
$ionosenterprise firewall create --datacenterid [dcid] --serverid [serverid] --nicid [nicid] --protocol [protocol]
```

### Update Firewall Rules

```
$ionosenterprise firewall update  --datacenterid [dcid] --serverid [serverid] --nicid [nicid] --id [firewallid] --sourceMac [mac_address]
```

## IP Block

### List IP Blocks

```
$ ionosenterprise ipblock list
```

### Get Specific IP Block

```
$ ionosenterprise ipblock show -i [ipblockid]
```

### Reserve IP Block

```
$ ionosenterprise ipblock create --location [location] --size [size] --name [name]
```

## Release IP Block

```
$ ionosenterprise ipblock delete -i [ipblockid]
```

## Location

```
ionosenterprise location list
```

## LAN

### List LANs

```
ionosenterprise lan list --datacenterid [dcid]
```

### Create LAN

```
ionosenterprise lan create --datacenterid [dcid] -p [path_to_json]

ionosenterprise lan create --datacenterid [dcid] --name [name] --public [boolean]
```

### Update LAN

```
ionosenterprise lan update --datacenterid [dcid] -p [path_to_json]

ionosenterprise lan update --datacenterid [dcid] --name [name] --public [boolean] -i [lanid] --ipfailover [ip1,nicid1;ip2,nicid2;...]
```

### Get LAN

```
ionosenterprise lan show --datacenterid [dcid] --id [lanid]
```

## User

### List Users

```
$ ionosenterprise user list
```

### Create User

```
$ ionosenterprise user create -p [path_to_json]

$ ionosenterprise user create --firstname [firstname] --lastname [lastname] --email [email] --password [password] --admin [boolean] --forcesecauth [boolean]
```

### Get Specific User

```
$ ionosenterprise user get -i [userid]

$ ionosenterprise user show -i [userid]
```

### Update User

```
$ ionosenterprise user update -i [userid] --firstname [firstname] --lastname [lastname] --email [email] --admin [boolean] --forcesecauth [boolean]
```

### Delete User

```
$ ionosenterprise user delete -i [userid]
```

## Group

### List Groups

```
$ ionosenterprise group list
```

### Create Group

```
$ ionosenterprise group create -p [path_to_json]

$ ionosenterprise group create --name [name] --createdatacenter [boolean] --createsnapshot [boolean] --reserveip [boolean] --accessactlog [boolean]
```

### Get Specific Group

```
$ ionosenterprise group get -i [groupid]

$ ionosenterprise group show -i [groupid]
```

### Update Group

```
$ ionosenterprise group update -i [groupid] --name [name] --createdatacenter [boolean] --createsnapshot [boolean] --reserveip [boolean] --accessactlog [boolean]
```

### Delete Group

```
$ ionosenterprise group delete -i [groupid]
```

### List Group Users

```
$ ionosenterprise group users -i [groupid]
```

### Add Group User

```
$ ionosenterprise group user --adduser [userid] -i [groupid]
```

### Remove Group User

```
ionosenterprise group user --removeuser [userid] -i [groupid]
```

## Share

### List Shares

```
$ ionosenterprise share list --groupid [groupid]
```

### Add Share

```
$ ionosenterprise share add --groupid [groupid] --resourceid [resourceid] --editprivilege [boolean] --shareprivilege [boolean]

$ ionosenterprise share create --groupid [groupid] --resourceid [resourceid] --editprivilege [boolean] --shareprivilege [boolean]
```

### Get Specific Share

```
$ ionosenterprise share get --groupid [groupid] -i [shareid]

$ ionosenterprise share show --groupid [groupid] -i [shareid]
```

### Update Share

```
$ ionosenterprise share update --groupid [groupid] -i [shareid] --editprivilege [boolean] --shareprivilege [boolean]
```

### Remove Share

```
$ ionosenterprise share delete --groupid [groupid] -i [shareid]

$ ionosenterprise share remove --groupid [groupid] -i [shareid]
```

## Resource

### List All Resources

```
$ ionosenterprise resource list
```

### List Specific Type Resources

```
$ ionosenterprise resource list --resourcetype [datacenter|snapshot|image|ipblock]
```

### Get Specific Type Resource

```
$ ionosenterprise resource get --resourcetype [datacenter|snapshot|image|ipblock] -i [resourceid]

$ ionosenterprise resource show --resourcetype [datacenter|snapshot|image|ipblock] -i [resourceid]
```

## Contract Resources

### List Contract Info

```
$ ionosenterprise contract list
```

### List Contract Info By Resource

```
$ ionosenterprise contract list --ctresource [cores|ram|hdd|ssd|ips]
```


## Support

You are welcome to contact us with questions or comments at [IonosEnterprise DevOps Central](https://devops.ionos.com/). Please report any issues via [GitHub's issue tracker](https://github.com/ionos-enterprise/ionos-enterprise-cli/issues).
