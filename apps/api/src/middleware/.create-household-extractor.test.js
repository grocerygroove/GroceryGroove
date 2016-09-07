const a = require("../utils/asyncify");
const createHouseholdExtractor = require("./create-household-extractor");
const tap = require("tap");

tap.test("middleware/create-household-extractor", a(function* (tap) {
    const logger = {
        child: () => logger,
        error: () => {},
    };
    const next = a(function* () {});

    const housholdExtractorMw = createHouseholdExtractor(logger);

    yield a(function* () {
        const ctx = {
            query: {
                "household_id": "10",
            },
            state: {},
        };

        yield housholdExtractorMw(ctx, next);

        const actual = ctx.state.householdId;
        const expected = 10;

        tap.equal(actual, expected, "household_id should be set as ctx.state.householdId");
    })();

    yield a(function* () {
        const ctx = {
            query: {
                "household_id": "notadigit",
            },
            state: {},
            request: {
                id: 1,
            },
        };

        yield housholdExtractorMw(ctx, next);

        const actual = ctx.status;
        const expected = 424;

        tap.equal(actual, expected, "Invalid format for household_id retuns a status of 424");
    })();

    yield a(function* () {
        const ctx = {
            query: {},
            state: {},
            request: {
                id: 1,
            },
        };

        yield housholdExtractorMw(ctx, next);

        const actual = ctx.status;
        const expected = 424;

        tap.equal(actual, expected, "No household_id returns a status of 424");
    })();
    tap.end();
}));
