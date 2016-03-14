#!/bin/bash

function install_nodejs() {
    distrib=''
    command -v lsb_release > /dev/null 2>&1
    if [ "$?" -eq 0 ]; then
        distrib="$(lsb_release -si)"
    fi
    if [ -z "$distrib" ] && [ -r /etc/lsb-release ]; then
        distrib="$(. /etc/lsb-release && echo "$DISTRIB_ID")"
    fi
    if [ -z "$distrib" ] && [ -r /etc/debian_version ]; then
        distrib='debian'
    fi
    if [ -z "$distrib" ] && [ -r /etc/fedora-release ]; then
        distrib='fedora'
    fi
    if [ -z "$distrib" ] && [ -r /etc/redhat-release ]; then
        distrib='redhat'
    fi
    if [ -z "$distrib" ] && [ -r /etc/arch-release ]; then
        distrib='arch'
    fi
    if [ -z "$distrib" ] && [ -r /etc/SuSE-brand ]; then
        distrib='suse'
    fi
    if [ -z "$distrib" ] && [ -r /etc/os-release ]; then
        distrib="$(. /etc/os-release && echo "$ID")"
    fi

    distrib="$(echo "$distrib" | tr '[:upper:]' '[:lower:]')"

    case "$distrib" in
        fedora|redhat|centos)
            yum -q -y clean all
            yum -q -y install epel-release
            yum -q -y install nodejs npm
            ;;
        ubuntu|debian|linuxmint)
            apt-get -y update
            apt-get -y --no-install-recommends install nodejs-legacy npm < /dev/null
            ;;
        arch)
            pacman -S -y --noconfirm --noprogressbar nodejs
            ;;
        suse)
            zypper -nq install nodejs
            ;;
        *)
            echo "Unable to identify Linux distribution."
            echo "Please install Node.js and NPM manually and install the ProfitBricks CLI with the following command:"
            echo
            echo "npm install -g profitbricks-cli"
            exit 1
            ;;
    esac
}

# Run as sudo if not already root user
if [ "$(id -u)" != "0" ]; then
   exec sudo "$0" "$@"
fi

# Check for nodejs binary and install nodejs package
command -v node || nodejs > /dev/null 2>&1
if [ "$?" -ne 0 ]; then
    install_nodejs
fi

# Install profitbricks-cli with NPM
npm install -g -s profitbricks-cli

cli_complete="complete -W '-h --help -V --version setup datacenter server \
volume snapshot loadbalancer nic ipblock drives image lan list get show create \
delete update attach detach start stop reboot -i --id -n --name -l --location \
-d --description -p --path --datacenterid -r --ram -c --cores -a \
--availabilityzone --licencetype --bootVolume --bootCdrom --volumeid \
--volumesize --volumename --imageid -b --bus -s --size --cpuHotPlug \
--cpuHotUnplug --ramHotPlug --ramHotUnplug --nicHotPlug --nicHotUnplug \
--discVirtioHotPlug --discVirtioHotUnplug --discScsiHotPlug \
--discScsiHotUnplug --ip --dhcp --serverid --lan --public --json -f --force' \
profitbricks"

# Enable profitbricks-cli auto-completion to the user environment
grep profitbricks $HOME/.profile
if [ "$?" -ne 0 ]; then
    echo $cli_complete >> $HOME/.profile
fi

source $HOME/.profile

echo "Enabled CLI auto-completion."
echo "Run following command for help: profitbricks"
