const a = require("./asyncify");
const camelifyObject = require("./camelify-object");
const tap = require("tap");

tap.test("utils/camelify-object", tap => {

    const input = {
        property_one: 1,
        property_two: 2,
        property_three: 3,
    };

    const actual = camelifyObject(input);

    const expected = {
        propertyOne: 1,
        propertyTwo: 2,
        propertyThree: 3,
    };

    tap.strictDeepEquals(actual, expected);


tap.end();
});
