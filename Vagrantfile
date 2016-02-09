# -*- mode: ruby -*-
# vi: set ft=ruby :
#
# * `memory` changes the amount of memory allocated to this vagrant
# * `port_offset` changes the magic number used for port forwarding (e.g., set
#    to 20000 to reach this vagrant's port 80 at the host's 20080)
#
Vagrant.configure(2) do |config|
    # Prefer VirtualBox
    config.vm.provider "virtualbox"

    # Start with Ubuntu
    config.vm.box = "ubuntu/trusty64"

    # Bump up memory to 2GB
    config.vm.provider "virtualbox" do |v|
        v.memory = 2000
    end

    # Set up port forwarding with a configurable offset
    ports = [
        # Second param unused, just for documentation
        [22,   'ssh'        ],
        [80,    'http1'     ],
        [8080,   'http2'     ],
    ]
    port_offset = 10000
    ports.each do |port, service|
        new_port = port + port_offset
        config.vm.network "forwarded_port", guest: port, host: new_port, id: service
    end

    # Allow the user to edit files on the host and have them turn up on the guest
    config.vm.synced_folder ".", "/opt/grocerygroove", :create => true

    # We'll need ssh forwarding for git
    config.ssh.forward_agent = true

    # Provisioning
    config.vm.provision "ansible" do |ansible|
        ansible.playbook = "etc/ansible/vagrant_playbook.yml"
        ansible.sudo = true
        ansible.groups = { 'vagrant' => ['default'] }
        # ansible.verbose =  'vvvv'
        ansible.extra_vars = {
            ansible_ssh_user: 'vagrant',
            ansible_connection: 'ssh',
            ansible_ssh_args: '-o ForwardAgent=yes',
            is_vagrant: 'yes'
        }
    end

end
