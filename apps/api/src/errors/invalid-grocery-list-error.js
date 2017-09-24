const InvalidGroceryListError = function (pathname) {
    this.name = "InvalidGroceryListError";
    this.message = `Invalid grocery list error in ${ pathname }`;
    this.stack = (new Error()).stack;

    this.pathname = pathname;

};
InvalidGroceryListError.prototype = Object.create(Error.prototype);
InvalidGroceryListError.prototype.constructor = InvalidGroceryListError;

module.exports = InvalidGroceryListError;

