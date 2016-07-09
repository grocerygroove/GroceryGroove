const DuplicateNameError = function (sqlError, pathname) {
    this.name = "DuplicateNameError";
    this.message = `Duplicate name error in ${ pathname }`;
    this.stack = (new Error()).stack;

    this.sqlError = sqlError;
    this.pathname = pathname;
};
DuplicateNameError.prototype = Object.create(Error.prototype);
DuplicateNameError.prototype.constructor = DuplicateNameError;

module.exports = DuplicateNameError;

