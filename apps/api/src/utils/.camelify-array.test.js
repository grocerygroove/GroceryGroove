const a = require("./asyncify");
const camelifyArray = require("./camelify-array");
const tap = require("tap");

tap.test("utils/camelify-array", tap => {

    const input = [
        {
            property_one: 1,
            property_two: 2,
            property_three: 3,
        },
        {
            property_four: 4,
            property_five: 5,
            property_six: 6,
        },
    ];

    const actual = camelifyArray(input);

    const expected = [
        {
            propertyOne: 1,
            propertyTwo: 2,
            propertyThree: 3,
        },
        {
            propertyFour: 4,
            propertyFive: 5,
            propertySix: 6,
        },
    ];

    tap.strictDeepEquals(actual, expected);


tap.end();
});
