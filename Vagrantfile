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
        [ 8080,   'api'       ],
        [ 5858,   'nodejs-debug'],
    ]
    port_offset = (ENV['port_offset'] || 10000).to_i
    ports.each do |port, service|
        new_port = port + port_offset
        config.vm.network "forwarded_port", guest: port, host: new_port, id: service
    end

    config.vm.synced_folder "./apps/api",           "/opt/api",         :create => true
    config.vm.synced_folder "./apps/queueworker",   "/opt/queueworker", :create => true
    config.vm.synced_folder "./apps/webclient",     "/opt/webclient",   :create => true
    config.vm.synced_folder "./etc/migrations",     "/etc/migrations",  :create => true
    config.vm.synced_folder "./etc/rambler",        "/etc/rambler",     :create => true

    config.ssh.forward_agent = true

    if FFI::Platform::IS_WINDOWS
        config.vm.provision :shell, :inline => %Q{
            if [ ! -f /usr/bin/ansible-playbook ]; then
                apt-get install software-properties-common
                apt-add-repository ppa:ansible/ansible
                apt-get update
                apt-get install -y ansible
            fi
            ansible-playbook \
                --inventory="localhost," \
                -c local \
                /vagrant/etc/ansible/vagrant_playbook.yml
        }
    else
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
end
