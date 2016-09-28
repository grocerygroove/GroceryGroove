const a = require("../src/utils/asyncify");
const execp = require("../src/utils/execp");
const join = require("path").join;

module.exports = a(function* resetTestingDb() {
    yield execp(`/bin/migrate downtesting`);
    yield execp(`/bin/migrate uptesting`);
});
