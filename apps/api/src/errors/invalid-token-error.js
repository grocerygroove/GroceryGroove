const InvalidTokenError = function (token, reason) {
    this.name = "InvalidTokenError";
    this.message = `"${ token }" is invalid for reason "${ reason }"`;
    this.stack = (new Error()).stack;

    this.token = token;
    this.reason = reason;
};
InvalidTokenError.prototype = Object.create(Error.prototype);
InvalidTokenError.prototype.constructor = InvalidTokenError;

module.exports = InvalidTokenError;

