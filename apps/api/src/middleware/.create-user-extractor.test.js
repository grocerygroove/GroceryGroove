const a = require("../utils/asyncify");
const createUserExtractorMw = require("./create-user-extractor");
const tap = require("tap");

tap.test("middleware/create-user-extractor", a(function* (tap) {
    const logger = {
        child: () => logger,
        error: () => {},
    };
    const next = a(function* () {});

    const userExtractorMw = createUserExtractorMw(logger);

    yield a(function* () {
        const ctx = {
            state: {
                token: {
                    data: {
                        "user_id": "testuser",
                    },
                },
            },
        };

        yield userExtractorMw(ctx, next);

        const actual = ctx.state.userId;
        const expected = "testuser";

        tap.equal(actual, expected, "userId should be set as ctx.state.userId");
    })();

    yield a(function* () {
        const ctx = {
            state: {
                token: "atoken",
            },
            request: {
                id: 1,
            },
        };

        yield userExtractorMw(ctx, next);
        const actual = ctx.status;
        const expected = 500;

        tap.equal(actual, expected, "ctx.status should be set to 500");
    })();

    tap.end();
}));
