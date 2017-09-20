# Wave Software Development Challenge

## Prerequisites

This application is configured to run in a virtualized environment provide by
VirtualBox. This requires that the host system (OSX or Linux) be installed
on the actual hardware and not virtualized

### OSX (Tested against macOS 10.12.6 Sierra)

Please install the following:

* [vagrant](https://releases.hashicorp.com/vagrant/2.0.0/vagrant_2.0.0_x86_64.dmg)
* [virtualbox](http://download.virtualbox.org/virtualbox/5.1.28/VirtualBox-5.1.28-117968-OSX.dmg)

### Linux (Tested against Ubuntu 16.10 YakketyYak)

Install NFS

```bash
$ sudo apt install nfs-kernel-server nfs-common
```

Please install the following:

* [vagrant](https://releases.hashicorp.com/vagrant/2.0.0/vagrant_2.0.0_x86_64.deb)
* [virtualbox](http://download.virtualbox.org/virtualbox/5.1.28/virtualbox-5.1_5.1.28-117968~Ubuntu~yakkety_amd64.deb)

**NOTE**
* You'll need to move this project out of your home directory if it is encrypted.
NFS is unable to mount encrypted directories

## Building and running the application

```bash
$ git clone git@github.com:justinjpacheco/se-challenge-payroll.git
$ cd se-challenge-payroll.git
$ vagrant up
# Once vagrant is done, visit http://localhost:8080
```
