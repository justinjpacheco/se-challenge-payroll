# Wave Software Development Challenge

## Prerequisites

This application is configured to run in a virtualized environment provide by
VirtualBox. This requires that the host system (OSX or Linux) be installed
on the actual hardware and not virtualized

### OSX (Tested on macOS 10.12.6 Sierra)

Download and Install the following:

* https://releases.hashicorp.com/vagrant/2.0.0/vagrant_2.0.0_x86_64.dmg
* http://download.virtualbox.org/virtualbox/5.1.28/VirtualBox-5.1.28-117968-OSX.dmg

### Linux (Tested on Ubuntu 17.04 Zesty Zapus)

Install NFS

```bash
$ sudo apt install nfs-kernel-server nfs-common
```

Download and Install the following:

* https://releases.hashicorp.com/vagrant/2.0.0/vagrant_2.0.0_x86_64.deb
* http://download.virtualbox.org/virtualbox/5.1.28/virtualbox-5.1_5.1.28-117968~Ubuntu~yakkety_amd64.deb

**NOTE**: You'll need to move this project out of your home directory if it is encrypted. NFS is unable to mount encrypted directories

## Building and running the application

git clone and cd into the repository

```bash
$ vagrant up
```

**NOTE**: While Vagrant is bring up the virtual machine, it may ask for your password.
Vagrant needs this to be able to modify the /etc/exports file to allow for NFS
mounts into the guest virtual machine.

Once vagrant is done, please visit http://localhost:8080

# Simplicity, Reproducibility and Automation

For this submission, I am particularly proud of a number of its design aspects. Most notably would be its use of AngularJS as the front-end framework, Python's virtualenv to for creating isolated Python environments, SQLAlchemy as the ORM and NPM with WebPack to manage the build and front-end assets. But what I am most proud of is its use of these three components: Vagrant, VirtualBox and Chef.

With Vagrant, VirtualBox and Chef you get the simplicity of bring up an entire system with a single command (vagrant up), the reliability to reproduce the environment on any platform (VirtualBox) and a tool to automate the whole process (Chef). As a developer, I value these features because they allow me focus on what matters and not worry about building and maintaining my development environment. With this system I don't have to worry about making sure I'm on the correct version of Linux or OSX or even Windows. If something goes wrong and I need to redeploy my environment, I don't have to read through pages of outdated README files to get back to a working system. Just nuke the box (vagrant destroy -f) and redeploy (vagrant up), it's that simple.

This works especially well in teams with multiple developers working on the same codebase. Commit whatever change is needed to the automation scripts, ask everyone involved to pull down the new changes and rebuild their environment. Or better yet, package the new environment into a custom vagrant box and update the Vagrantfile pull down that box instead.

When all three are used together, they create such a simple and effective way to manage any kind of environment that people will wonder how they got along without them, **_I know I sure do_**.
