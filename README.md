# ProfitBricks CLI

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
* [Support](#support)

## Concepts

The ProfitBricks CLI wraps the [ProfitBricks REST API](https://devops.profitbricks.com/api/rest/) allowing you to interact with it from a command-line interface.

## Getting Started

Before you begin you will need to have [signed-up](https://www.profitbricks.com/signup/) for a ProfitBricks account. The credentials you establish during sign-up will be used to authenticate against the [ProfitBricks API](https://devops.profitbricks.com/api/rest/).

## Installation

Please utilize one of the following URL's to retrieve an install script that is appropriate for your environment.

### Linux

[GitHub - ProfitBricks Linux Install](https://github.com/profitbricks/profitbricks-cli/tree/master/install/linux/install.sh)

### Mac

[GitHub - ProfitBricks Mac Install](https://github.com/profitbricks/profitbricks-cli/tree/master/install/mac/install.sh)

### Windows

[GitHub - ProfitBricks Windows Install](https://github.com/profitbricks/profitbricks-cli/tree/master/install/windows/install.bat)

If you prefer, you may install `nodejs` and `npm` manually. Then run the following to to install the ProfitBricks CLI module globally:

```
npm install -g profitbricks-cli
```

## Overview

A list of available operations can be accessed directly from the command line.

Run `profitbricks` or `profitbricks -h` or `profitbricks --help`:

```
  Usage: profitbricks [Options]

  Options:

    -h, --help                    output usage information
    -V, --version                 output the version number
    setup                         Configures credentials for ProfitBricks CLI
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
    -b --bus [env]                Bus type (VIRTIO or IDE)
    -t --type [env]               The disk type. Currently only HDD.
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
    --lan [env]                   The LAN ID the NIC will sit on. If the LAN ID does not exist it will be created.
    --public [env]                Boolean indicating if the LAN faces the public Internet or not.
    --requestid [env]             Request UUID
    --nicid [env]                 Network Interface UUID
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
    --json                        Print results as JSON string
    --addip [env]                 Add IP
    --removeip [env]              Remove IP
    -f, --force                   Forces execution
```

## Configuration

Before using the ProfitBrick's CLI to perform any operations, we'll need to set our credentials:

```
$ profitbricks setup
>prompt: username:username
>prompt: password:
```

You will be notified with the following message if you have provided incorrect credentials:

```
>Invalid user name or password. Please try again!
```

After successful authentication you will no longer need to provide credentials unless you want to change them. They are stored as a BASE64 encoded string in a '.auth' file in your home directory.

# How To's:

These examples assume that you don't have any resources provisioned under your account. The first thing we will want to do is create a data center to hold all of our resources.

## Create Data Center

We need to supply some parameters to get our first data center created. In this case, we will set the location to 'us/las' so that this data center is created under the [DevOps Data Center](https://devops.profitbricks.com/tutorials/devops-data-center-information/). Other valid locations can be determined by reviewing the [REST API Documentation](https://devops.profitbricks.com/api/rest/#locations). That documentation is an excellent resource since that is what the ProfitBricks CLI is calling to complete these operations.

```
$ profitbricks datacenter create --name "Demo" --description "CLI Demo Data Center" --location "us/las"

Datacenter
-----------------------------------------------------
Id                                    Name  Location
------------------------------------  ----  ---------
3fc832b1-558f-48a4-bca2-af5043975393  Demo  us/las

RequestID: 45dbf0ba-fc1b-4a2c-855f-a11705a996b8
```

Et voilà, we've successfully provisioned a data center. Notice the "Id" that was returned. That UUID was assigned to our new data center and will be needed for other operations. The "RequestID" that was returned can be used to check on the status of any `create` or `update` operations.

```
$ profitbricks request get -i 45dbf0ba-fc1b-4a2c-855f-a11705a996b8

Status: DONE
Message: Request has been successfully executed
```

## Create Server

Next we'll create a server in the data center. This time we have to pass the 'Id' for the data center in, along with some other relevant properties (processor cores, memory, boot volume or boot CD-ROM) for the new server.

```
$ profitbricks server create --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393 --cores 2 --name "Demo Server" --ram 256 --cpufamily AMD_OPTERON

Server
------------------------------------------------------------------------------------------
Id                                    Name         AvailabilityZone  State  Cores  Memory
------------------------------------  -----------  -----------------  -----  -----  ------
03334965-466b-470a-8fe5-6d6e461402a5  Demo Server  null               BUSY   2      256RAM
```

## Update Server

Whoops, we didn't assign enough memory to our instance. Lets go ahead and update the server to increase the amount of memory it has assigned. We'll need the datacenterid, the id of the server we are updating, along with the parameters that we want to change.

```
$ profitbricks server update --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393 -i 11767ba1-6290-420f-a0bf-b77679a285b2 --cores 1 --name "Demo Server" --ram 1024

Server
-------------------------------------------------------------------------------------------
Id                                    Name         Availability Zone  State  Cores  Memory
------------------------------------  -----------  -----------------  -----  -----  -------
03334965-466b-470a-8fe5-6d6e461402a5  Demo Server  AUTO               BUSY   1      1024RAM
```

## List Servers

Lets take a look at the list of servers in our data center. There are a couple more listed in here for demonstration purposes.

```
$ profitbricks server list --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393

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
$ profitbricks volume create --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393 --size 12 --bus VIRTIO --licencetype LINUX --type HDD --name "Demo Srvr 1 Boot" --sshkey [ssh_key_string]

Volume
------------------------------------------------------------------------
Id                                    Name  Size  Licence  Bus     State
------------------------------------  ----  ----  -------  ------  -----
d7dc58a1-9505-48f5-9db4-22cff0659cf8  null  12    LINUX    VIRTIO  BUSY
```

## Attach Volume

The volume we've created is not yet connected or attached to a server. To accomplish that we'll use the `dcid` and `serverid` values returned from the previous commands:

```
$ profitbricks volume attach --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393 --serverid 03334965-466b-470a-8fe5-6d6e461402a5 -i d7dc58a1-9505-48f5-9db4-22cff0659cf8

Volume
----------------------------------------------------------------------------------
Id                                    Name              Size  Licence  Bus   State
------------------------------------  ----------------  ----  -------  ----  -----
d7dc58a1-9505-48f5-9db4-22cff0659cf8  Demo Srvr 1 Boot  12    LINUX    null  BUSY
```

## List Volumes

Let's take a look at all the volumes in the data center:

```
$ profitbricks volume list --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393

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
$ profitbricks snapshot create --datacenterid 3fc832b1-558f-48a4-bca2-af5043975393 --volumeid d231cd2e-89c1-4ed4-b4ad-d0a2c8b2b4a7

Snapshot
-------------------------------------------------------------------------------------------------------------
Id                                    Name                                  Size  Created               State
------------------------------------  ------------------------------------  ----  --------------------  -----
cf90b2e3-179b-4bff-a84c-d53ca58487dd  Demo Srvr 1 Boot-Snapshot-07/27/2015  null  2015-07-27T17:41:41Z  BUSY
```

## List Snapshots

Here is a list of the snapshots in our account:

```
$ profitbricks snapshot list

Snapshots
-----------------------------------------------------------------------------------------------------------------
Id                                    Name                                  Size  Created               State
------------------------------------  ------------------------------------  ----  --------------------  ---------
cf90b2e3-179b-4bff-a84c-d53ca58487dd  Demo Srvr 1 Boot-Snapshot-07/27/2015  10    2015-07-27T17:41:42Z  AVAILABLE
```

## Update Snapshot

Now that we have a snapshot created, we can change the name to something more descriptive:

```
$ profitbricks snapshot update -i cf90b2e3-179b-4bff-a84c-d53ca58487dd --name "Demo Srvr 1 OS just installed"

Snapshot
------------------------------------------------------------------------------------------------------
Id                                    Name                           Size  Created               State
------------------------------------  -----------------------------  ----  --------------------  -----
cf90b2e3-179b-4bff-a84c-d53ca58487dd  Demo Srvr 1 OS just installed  10    2015-07-27T17:41:42Z  BUSY
```

## Delete Snapshot

We can delete our snapshot when we are done with it:

```
$ profitbricks snapshot delete -i cf90b2e3-179b-4bff-a84c-d53ca58487dd

You are about to delete a snapshot. Do you want to proceed? (y/n
prompt: yes:  y
```

## Summary

Now we've had a taste of working with the ProfitBricks CLI. The reference section below will provide some additional information regarding what parameters are available for various operations.

# Reference

## Data Center

### List Data Centers

```
$ profitbricks datacenter list
```

### Get Specfic Data Center

```
$ profitbricks datacenter get -i [dcid]
$ profitbricks datacenter show -i [dcid]
```

### Create Data Center

```
$ profitbricks datacenter create -p [path_to_json]

$ profitbricks datacenter create --name [name] --description [text] --location [location]
```

### Update Data Center

```
$ profitbricks datacenter update -i [dcid] --name [name] --description [text]
```

### Delete Data Center

```
$ profitbricks datacenter delete -i [dcid]
```

## Server

### List Servers

```
$ profitbricks server list --datacenterid [dcid]
```

### Get Specific Server

```
$ profitbricks server show --datacenterid [dcid] -i [serverid]
```

### Create Server

```
$ profitbricks server create --datacenterid [dcid] --cores [cores] --name [name] --ram [ram] --cpufamily [cpu_type] --volumeid [preexisting_volume_id]

$ profitbricks server create --datacenterid [dcid] -p [path_to_json]
```

### Update Server

```
$ profitbricks server update --datacenterid [dcid] -i [serverid] --cores [cores] --name [name] --ram [ram]
```

### Delete Server

```
$ profitbricks server delete --datacenterid [dcid] -i [serverid]
```

### Start Server

```
$ profitbricks server start --datacenterid [dcid] -i [serverid]
```

### Stop Server

```
$ profitbricks server stop --datacenterid [dcid] -i [serverid]
```

### Reboot Server

```
$ profitbricks server reboot --datacenterid [dcid] -i [serverid]
```

## Volume

### List Volumes

```
$ profitbricks volume list --datacenterid [dcid]
```

### Get Specific Volume

```
$ profitbricks volume show --datacenterid [dcid] -i [volumeid]
```

### Create Volume

```
$ profitbricks volume create --datacenterid [dcid] -p [path_to_json]

$ profitbricks volume create --datacenterid  [dcid] --name [name] --size [size] --bus [bus] --type [HDD/SSD]
```

### Attach Volume

```
$ profitbricks volume attach --datacenterid [dcid] --serverid [serverid] -i [volumeid]
```

### Detach Volume

```
$ profitbricks volume detach --datacenterid [dcid] --serverid [serverid] -i [volumeid]
```

### Update Volume

```
$ profitbricks volume update -i [id] --datacenterid [dcid] --name [name]
```

### Delete Volume

```
$ profitbricks volume delete --datacenterid [dcid] -i [volumeid]
```

## Snapshot

### List Snapshots

```
$ profitbricks snapshot list
```

### Create Snapshot

```
$ profitbricks snapshot create --datacenterid [dcid] --volumeid [volumeid]
```

### Update Snapshot

```
$ profitbricks snapshot update -i [snapshotid] --name [name]
```

### Delete Snapshot

```
$ profitbricks snapshot delete -i [snapshotid]
```

## Load Balancer

### List Load Balancers

```
$ profitbricks loadbalancer list --datacenterid [dcid]
```

### Get Specific Load Balancer

```
$ profitbricks loadbalancer show --datacenterid [dcid] -i [loadbalancerid]
```

### Create Load Balancer

```
$ profitbricks loadbalancer create --datacenterid [dcid] --name  [name] --ip [ip] --dhcp [true|false]

$ profitbricks loadbalancer create --datacenterid [dcid] -p [path_to_json]
```

### Update Load Balancer

```
$ profitbricks loadbalancer update -i [loadbalancerid] --datacenterid [dcid] --name [name]
```

### Delete Load Balancer

```
$ profitbricks loadbalancer delete -i [loadbalancerid] --datacenterid [dcid]
```

## Image

### List Images

```
$ profitbricks image list
```

### Get Specific Image

```
$ profitbricks image show -i [imageid]
```

### Update Image

```
$ profitbricks image update -i [imageid] --name [name] ---description [description] --licencetype [licencetype]
```

### Delete Image

```
$ profitbricks image delete -i [imageid]
```

## NIC

### List NICs

```
$ profitbricks nic list --datacenterid [dcid] --serverid [serverid]
```

### Get Specific NIC

```
$ profitbricks nic get --datacenterid [dcid] --serverid [serverid] -i [nicid]
```

### Create NIC

```
$ profitbricks nic create --datacenterid [dcid]--serverid [serverid] -p [path_to_json]

$ profitbricks nic create --datacenterid [dcid] --serverid [serverid] --name [name] --ip [ip] --dhcp [true|false] --lan [lan]
```

### Update NIC

```
$ profitbricks nic update -i [nicid] --datacenterid [dcid] --serverid [serverid] --name [name] --ip [ip] --dhcp [true|false] --lan [lan]
$ profitbricks nic update --datacenterid [dc] --serverid [server] -i [nicid] --addip 1.1.1.1
$ profitbricks nic update --datacenterid [dc] --serverid [server] -i [nicid] --removeip 1.1.1.1
```
 

### Delete NIC

```
$ profitbricks nic delete -i [nicid] --datacenterid [dcid] --serverid [serverid]
```

### List Load Balanced NIC

```
$ profitbricks nic list --datacenterid [dcid] --loadbalancerid [lbid]
```

### Attach a NIC to a Load Balancer

```
$ profitbricks nic attach --datacenterid [dcid] --loadbalancerid [lbid] -i [nicid]
```

### Detach a NIC from a Load Balancer

```
$ profitbricks nic detach --datacenterid [dcid] --loadbalancerid [lbid] -i [nicid]
```

## Firewall Rules

### List Firewall Rules

```
$profitbricks firewall list --datacenterid [dcid] --serverid [serverid] --nicid [nicid]
```

### Get Specific Firewall Rule 

```
$profitbricks firewall get --datacenterid [dcid] --serverid [serverid] --nicid [nicid] --id [firewallid]
```

### Create Firewall Rules

```
$profitbricks firewall create --datacenterid [dcid] --serverid [serverid] --nicid [nicid] --protocol [protocol]
```

### Update Firewall Rules

```
$profitbricks firewall update  --datacenterid [dcid] --serverid [serverid] --nicid [nicid] --id [firewallid] --sourceMac [mac_address]
```

## IP Block

### List IP Blocks

```
$ profitbricks ipblock list
```

### Get Specific IP Block

```
$ profitbricks ipblock show -i [ipblockid]
```

### Reserve IP Block

```
$ profitbricks ipblock create --location [location] --size [size] --name [name]
```

## Release IP Block

```
$ profitbricks ipblock delete -i [ipblockid]
```

## Location

```
profitbricks location list
```

## Support

You are welcome to contact us with questions or comments at [ProfitBricks DevOps Central](https://devops.profitbricks.com/). Please report any issues via [GitHub's issue tracker](https://github.com/profitbricks/profitbricks-cli/issues).
