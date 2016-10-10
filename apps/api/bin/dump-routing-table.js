#!/usr/bin/env nodejs

const collapseGroup = require("koa-group-router/collapse-group");
const rootGroup = require("../src/server/routes");
const Table = require("cli-table");

const t = new Table({
    head: ["method", "path", "middlewares", "services"],
});


collapseGroup(rootGroup).map(route => t.push([
    route.method,
    route.path,
    (route.middlewares || []).join(", "),
    (route.services || []).join(", "),
]))

console.log(t.toString());

