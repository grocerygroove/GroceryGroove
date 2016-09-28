const a = require("./asyncify");
const execp = require("./execp");

module.exports = a(function* resetTestingDatabase () {
    if (process.env.NODE_ENV !== "development") {
        throw new Error("must be in dev env to reset test db");
    }

    yield execp(`/bin/migrate downtesting`);
    yield execp(`/bin/migrate uptesting`);
});
