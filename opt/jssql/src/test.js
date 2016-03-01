"use strict";
const parse = require("./parse");
const renderSql = require("./render-sql");

const fs = require("fs");

const name = "create_user_with_default_household";
const content = fs.readFileSync(`${ __dirname }/${ name }.sql`, 'utf8');
const proc = parse(content);

console.log(renderSql(name, proc.attributes, proc.body));
