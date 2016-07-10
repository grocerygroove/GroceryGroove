const InvalidRowFilterError = function (type) {
    this.name = "InvalidRowFilterError";
    this.message = `Filter type "${ type }" is not valid. Fix it dummy.`;
    this.stack = (new Error()).stack;

    this.type = type;
};
InvalidRowFilterError.prototype = Object.create(Error.prototype);
InvalidRowFilterError.prototype.constructor = InvalidRowFilterError;

module.exports = InvalidRowFilterError;

