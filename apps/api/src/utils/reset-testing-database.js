const a = require("./asyncify");
const execp = require("./execp");

module.exports = a(function* resetTestingDatabase () {
    yield execp(`/bin/migrate downtesting`);
    yield execp(`/bin/migrate uptesting`);
});
