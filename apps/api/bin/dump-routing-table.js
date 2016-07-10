#!/usr/bin/env nodejs

const collapseGroup = require("../src/server/route-tools/collapse-group");
const rootGroup = require("../src/server/routes");

console.log(JSON.stringify(collapseGroup(rootGroup), null, 4));
