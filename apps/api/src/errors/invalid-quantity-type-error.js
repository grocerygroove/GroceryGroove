const InvalidQuantityTypeError = function (pathname) {
    this.name = "InvalidQuantityTypeError";
    this.message = `Invalid quantity type error in ${ pathname }`;
    this.stack = (new Error()).stack;

    this.pathname = pathname;
};
InvalidQuantityTypeError.prototype = Object.create(Error.prototype);
InvalidQuantityTypeError.prototype.constructor = InvalidQuantityTypeError;

module.exports = InvalidQuantityTypeError;
