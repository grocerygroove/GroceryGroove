/**
 * IMPURE! modifies passed in function. Alternative is to create a new named
 * function that wraps the one being passed in. Considering how this is meant
 * to be used (pass an anonymous function in, apply the name, it gets returned,
 * I felt it okay.
 */
module.exports = function renameFunction (name, func) {
    Object.defineProperty(func, "name", {
        value: name,
    });

    return func;
};
