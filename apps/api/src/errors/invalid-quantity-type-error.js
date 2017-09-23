const InvalidQuantityTypeError = function (sqlError, pathname) {
    this.name = "InvalidQuantityTypeError";
    this.message = `Invalid quantity type error in ${ pathname }`;
    this.stack = (new Error()).stack;

    this.sqlError = sqlError;
    this.pathname = pathname;
};
InvalidQuantityTypeError.prototype = Object.create(Error.prototype);
InvalidQuantityTypeError.prototype.constructor = InvalidQuantityTypeError;

module.exports = InvalidQuantityTypeError;

