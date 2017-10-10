#!/bin/bash

# Make sure only root can run our script
if [ "$(id -u)" != "0" ]; then
   exec sudo "$0" "$@"
fi

NODEJS_VERSION="8.6.0"

# If the node command does not exist, download and install Node.js
command -v node > /dev/null 2>&1
if [ $? -ne 0 ]; then
    pkgname="node-v${NODEJS_VERSION}.pkg"
    tmpfile="/tmp/${pkgname}"

    curl -sfo ${tmpfile} http://nodejs.org/dist/v${NODEJS_VERSION}/${pkgname}

    if [ $? -eq 0 ]; then
        installer -target / -pkg $tmpfile
        rm -f $tmpfile
    else
        echo "Node.js OS X package download failed."
        exit 0
    fi
fi

# Install profitbricks-cli using NPM
npm install -g -s profitbricks-cli

cli_complete="complete -W '-h --help -V --version setup datacenter server \
volume snapshot loadbalancer nic firewall ipblock drives image lan request \
location group user share resource -i --id -n --name -l --location \
-d --description -p --path --datacenterid --loadbalancerid -r --ram -c --cores \
-a --availabilityzone --licencetype --sshkey --bootVolume --bootCdrom --volumeid \
--volumesize --volumename --imageid --imagealias -b --bus -t --type --imagepassword \
-s --size --cpuHotPlug --cpuHotUnplug --ramHotPlug --ramHotUnplug --nicHotPlug \
--nicHotUnplug --discVirtioHotPlug --discVirtioHotUnplug --discScsiHotPlug \
--discScsiHotUnplug --ip --dhcp --serverid --cpufamily --lan --public --ipfailover \
--requestid --nicid --nat --protocol --sourceMac --sourceIp --sourceIp --targetIp \
--targetIp --portRangeStart --portRangeEnd --portRangeEnd --icmpType --icmpCode \
--groupid --resourceid --resourcetype --editprivilege --shareprivilege \
--createdatacenter --createsnapshot --reserveip --accessactlog --firstname \
--lastname --email --password --admin --forcesecauth --json --addip --removeip \
--adduser --removeuser -f --force' \
profitbricks"

# Enable profitbricks-cli auto-completion to the user environment
grep profitbricks $HOME/.profile
if [ $? -ne 0 ]; then
    echo $cli_complete >> $HOME/.profile
fi

echo
echo "Run the following to enable CLI auto-complete:"
echo "source $HOME/.profile"
