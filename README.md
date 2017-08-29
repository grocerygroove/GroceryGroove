# GroceryGroove

A grocery website for managing shared grocery lists, home inventory, and recipes.

GroceryGroove is still heavily under development and many parts of the site are non-functioning.

## Contributing
Our dev environment is packaged as a vagrant vm, provisioned by anisible. So those two are needed. To build/launch the vm, in the root dir of the project run:

    vagrant up && vagrant ssh

### API
Within the VM, the api is located within:

    /opt/gg/apps/api

The api is automatically started on vm spinup.

Once the VM is spun up, the API can be reached at http://localhost:18080 on your local machine (vagrant forwards the internal API port 8080 to your local port offset by 10000)

### Web Client
Within the VM, the webclient is located at:

    /opt/gg/apps/webclient

The webclient is automatically transpiled at VM creation-time but can be manually transpiled (say after a code change) with:

    cd /opt/gg/apps/webclient && npm run browserpack

Once the VM is spun up, the Web Client can be reached at http://localhost:10080 on your local machine (vagrant forwards the internal web hosting port 80 to your local port offset by 10000)
