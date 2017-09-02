/**
 * IMPURE! Due to the fact that the values of `target` can and will be
 * functions, this updates in place.
 *
 * Helper function to help deal with the issue of having a
 * `${path}/something.js` file and a bunch of files under the
 * `${path}/something/` directory. This handles that by looking to see when you
 * try to assign an item to a name, if one of them is an object (a directory)
 * and one of the is a function (a file), then it applies all of the object's
 * properties to the function and sets that function in the place of `name`.
 */
module.exports = function collapse (target, name, item) {
    if (target[name]) {
        if (typeof(target[name]) === typeof(item)) {
            throw new Error(`Duplicate name: "${ name }"`);
        }

        switch (typeof target[name]) {
            case "object":
                target[name] = Object.assign(item, target[name]);
            break;

            case "function":
                Object.assign(target[name], item);
            break;

            default:
                throw new Error(`unknown type "${ typeof target[name] }" for "${ name }"`);
        }
    } else {
        target[name] = item;
    }
};
