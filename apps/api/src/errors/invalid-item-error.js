const InvalidItemError = function (pathname) {
    this.name = "InvalidItemError";
    this.message = `Invalid item error in ${ pathname }`;
    this.stack = (new Error()).stack;

    this.pathname = pathname;

};
InvalidItemError.prototype = Object.create(Error.prototype);
InvalidItemError.prototype.constructor = InvalidItemError;

module.exports = InvalidItemError;
