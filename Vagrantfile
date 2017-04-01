# -*- mode: ruby -*-
# vi: set ft=ruby :
#
# * `memory` changes the amount of memory allocated to this vagrant
# * `port_offset` changes the magic number used for port forwarding (e.g., set
#    to 20000 to reach this vagrant's port 80 at the host's 20080)

require 'ffi'

Vagrant.configure(2) do |config|
    config.vm.provider "virtualbox"
    config.vm.box = "ubuntu/trusty64"
    config.vm.provider "virtualbox" do |v|
        v.memory = 2048
    end

    ports = [
        [   80,   'webclient' ],
        [ 5432,   'postgres'  ],
        [ 5858,   'nodejs-debug'],
        [ 7000,   'web-socket-server'],
        [ 8080,   'api'       ],
    ]
    port_offset = (ENV['port_offset'] || 10000).to_i
    ports.each do |port, service|
        new_port = port + port_offset
        config.vm.network "forwarded_port", guest: port, host: new_port, id: service
    end

    config.vm.synced_folder ".", "/opt/gg", create: true

    config.ssh.forward_agent = true

    config.vm.provision "ansible" do |ansible|
        ansible.playbook = "etc/ansible/vagrant_playbook.yml"
        ansible.sudo = true
        ansible.groups = {
        'vagrant' => ['default']
        }
        ansible.extra_vars = {
            ansible_ssh_user: 'vagrant',
            ansible_connection: 'ssh',
            ansible_ssh_args: '-o ForwardAgent=yes',
            is_vagrant: 'yes'
        }

    end
end
