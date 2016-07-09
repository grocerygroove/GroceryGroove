/**
 * Basically, in order to require a string as if it were a file, we need to
 * convert the string into a function that accepts the normal "free variables"
 * that module receives; `module` and `exports` where
 * `module.exports === exports`, the `require` function to pull in other files
 * relative to where we say this code should be running from, and the
 * `__dirname` and `__filename` pairs.
 *
 * Turns out the last two items are easy, but the first two items aren't
 * documented so well.
 */
const AbsolutePathnameRequiredError = require("../errors/absolute-pathname-required-error");
const dirname = require("path").dirname;
const isAbsolutePath = require("path").isAbsolute;
const Module = require("module");
const vm = require("vm");

const createModule = function (pathname) {
    const retval = new Module(pathname);
    retval.filename = pathname;
    retval.paths = Module._nodeModulePaths(dirname(pathname));

    return retval;
};

const createRequire = function (module) {
    const retval = function (pathname) {
        return Module._load(pathname, module);
    };
    retval.resolve = function (pathname) {
        return Module._resolveFilename(pathname, module);
    };
    retval.main = process.mainModule;
    retval.extensions = require.extensions;
    retval.cache = require.cache;

    return retval;
};

module.exports = function requireStringAsFile (pathname, codeString) {
    if (!isAbsolutePath(pathname)) {
        throw new AbsolutePathnameRequiredError(pathname);
    }
    const moduleFunction = vm.runInThisContext(Module.wrap(codeString), pathname);
    const mod = createModule(pathname);
    const req = createRequire(mod);

    moduleFunction(mod.exports, req, mod, pathname, dirname(pathname));

    return mod.exports;
};
