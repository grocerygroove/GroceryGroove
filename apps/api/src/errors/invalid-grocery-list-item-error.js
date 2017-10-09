const InvalidGroceryListItemError = function (pathname) {
    this.name = "InvalidGroceryListItemError";
    this.message = `Invalid grocery list item error in ${ pathname }`;
    this.stack = (new Error()).stack;

    this.pathname = pathname;

};
InvalidGroceryListItemError.prototype = Object.create(Error.prototype);
InvalidGroceryListItemError.prototype.constructor = InvalidGroceryListItemError;

module.exports = InvalidGroceryListItemError;
