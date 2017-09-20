# Wave Software Development Challenge

## Prerequisites

This application is configured to run in a virtualized environment provide by
VirtualBox. This requires that the host system (OSX or Linux) be installed
on the actual hardware and not virtualized

### OSX

Please install the following:

* [vagrant](https://releases.hashicorp.com/vagrant/2.0.0/vagrant_2.0.0_x86_64.dmg)
* [virtualbox](http://download.virtualbox.org/virtualbox/5.1.28/VirtualBox-5.1.28-117968-OSX.dmg)

### Linux

* install vagrant, virtualbox, nfs-kernel-server, nfs-common
* need to install vagrant and virtualbox from websites. apt has broken packages
* this won't work with encrypted home directories

## Building and running the application

```bash
$ vagrant up
# Once vagrant is done, visit http://localhost:8080
```


