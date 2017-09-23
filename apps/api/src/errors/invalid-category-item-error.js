const InvalidCategoryItemError = function (sqlError, pathname) {
    this.name = "InvalidCategoryItemError";
    this.message = `Invalid category item error in ${ pathname }`;
    this.stack = (new Error()).stack;

    this.sqlError = sqlError;
    this.pathname = pathname;
};
InvalidCategoryItemError.prototype = Object.create(Error.prototype);
InvalidCategoryItemError.prototype.constructor = InvalidCategoryItemError;

module.exports = InvalidCategoryItemError;

