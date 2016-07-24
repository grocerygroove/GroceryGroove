#!/usr/bin/env nodejs

const rootGroup = require("../src/server/routes");

rootGroup.routes.forEach((obj) => {
    obj.routes.forEach((route) => {
        if (route.parameters || route.returns) {
            console.log(`Route : ${route.method} ${obj.path}${(!route.path) ? "" : route.path}`);

            if(route.parameters) {
                console.log("Parameters : ");
                console.log(JSON.stringify(route.parameters, null, 4));
            }
            if (route.returns) {
                console.log("Returns : ");
                console.log(JSON.stringify(route.returns, null, 4));
            }
            console.log("\n");
        }
    });
});
