#!/usr/bin/env nodejs

const rootGroup = require("../src/server/routes");
const createSwagger = require("../src/server/create-swagger");
console.log(JSON.stringify(createSwagger(rootGroup), null, 4));
