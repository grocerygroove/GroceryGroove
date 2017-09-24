const InvalidCategoryError = function (pathname) {
  this.name = "InvalidCategoryError";
  this.message = `Invalid category error in ${ pathname }`;
  this.stack = (new Error()).stack;

  this.pathname = pathname;

};
InvalidCategoryError.prototype = Object.create(Error.prototype);
InvalidCategoryError.prototype.constructor = InvalidCategoryError;

module.exports = InvalidCategoryError;

