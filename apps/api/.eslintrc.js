module.exports = {
    env: {
        es6: true,
        node: true,
    },
    parserOptions: {
        sourceType: "module",
    },

    // rules should be in order of http://eslint.org/docs/rules
    rules: {
        // Possible Errors
        "no-cond-assign": ["error", "always"],
        "no-console": ["error"],
        "no-constant-condition": ["error"],
        "no-control-regex": ["error"],
        "no-debugger": ["error"],
        "no-dupe-args": ["error"],
        "no-dupe-keys": ["error"],
        "no-duplicate-case": ["error"],
        "no-empty": ["error"],
        "no-empty-character-class": ["error"],
        "no-ex-assign": ["error"],
        "no-extra-boolean-cast": ["error"],
        "no-extra-semi": ["error"],
        "no-func-assign": ["error"],
        "no-inner-declarations": ["error"],
        "no-invalid-regexp": ["error"],
        "no-irregular-whitespace": ["error"],
        "no-negated-in-lhs": ["error"],
        "no-obj-calls": ["error"],
        "no-prototype-builtins": ["error"],
        "no-regex-spaces": ["error"],
        "no-sparse-arrays": ["error"],
        "no-unexpected-multiline": ["error"],
        "no-unreachable": ["error"],
        "use-isnan": ["error"],
        "valid-jsdoc": ["off"],
        "valid-typeof": ["error"],

        // Best Practices
        "accessor-pairs": ["error"],
        "array-callback-return": ["error"],
        "block-scoped-var": ["error"],
        //"complexity"
        "consistent-return": ["error"],
        "curly": ["error", "all"],
        "default-case": ["error"],
        "dot-location": ["error", "property"],
        "dot-notation": ["error"],
        "eqeqeq": ["error", "allow-null"],
        "guard-for-in": ["error"],
        "no-alert": ["error"],
        "no-caller": ["error"],
        "no-case-declarations": ["error"],
        "no-div-regex": ["error"],
        //"no-else-return"
        //"no-empty-function"
        "no-empty-pattern": ["error"],
        //"no-eq-null"
        "no-eval": ["error"],
        "no-extend-native": ["error"],
        "no-extra-bind": ["error"],
        //"no-extra-label"
        "no-fallthrough": ["error"],
        "no-floating-decimal": ["error"],
        "no-implicit-coercion": ["error", {
            "number": true,
            "boolean": true,
            "string": false,
            "allow": [ "!!" ],
        }],
        "no-implicit-globals": ["error"],
        "no-implied-eval": ["error"],
        //"no-invalid-this"
        "no-iterator": ["error"],
        "no-labels": ["error"],
        "no-lone-blocks": ["error"],
        "no-loop-func": ["error"],
        //"no-magic-numbers"
        "no-multi-spaces": ["error"],
        "no-multi-str": ["error"],
        "no-native-reassign": ["error"],
        "no-new": ["error"],
        "no-new-func": ["error"],
        "no-new-wrappers": ["error"],
        "no-octal": ["error"],
        "no-octal-escape": ["error"],
        //"no-param-reassign"
        "no-proto": ["error"],
        "no-redeclare": ["error"],
        "no-return-assign": ["error"],
        "no-script-url": ["error"],
        "no-self-assign": ["error"],
        //"no-self-compare"
        "no-sequences": ["error"],
        "no-throw-literal": ["error"],
        "no-unmodified-loop-condition": ["error"],
        "no-unused-expressions": ["error"],
        //"no-unused-labels"
        "no-useless-call": ["error"],
        "no-useless-concat": ["error"],
        "no-useless-escape": ["error"],
        "no-void": ["off"],
        "no-warning-comments": ["error"],
        "no-with": ["error"],
        "radix": ["error"],
        "vars-on-top": ["error"],
        "yoda": ["error", "never"],

        // Strict Mode
        "strict": ["error"],

        // Variables
        "init-declarations": ["error", "never", {
            "ignoreForLoopInit": true,
        }],
        "no-catch-shadow": ["error"],
        "no-delete-var": ["error"],
        //"no-label-var"
        //"no-restricted-globals"
        //"no-shadow"
        //"no-shadow-restricted-names"
        //"no-undef"
        //"no-undef-init"
        //"no-undefined"
        //"no-unused-vars"
        //"no-use-before-define"

        // Node.js and CommonJS
        //"callback-return"
        "global-require": ["error"],
        //"handle-callback-err"
        "no-mixed-requires": ["error"],
        "no-new-require": ["error"],
        "no-path-concat": ["off"],
        "no-process-env": ["error"],
        "no-process-exit": ["error"],
        "no-restricted-modules": ["off"],
        "no-sync": ["error"],

        // Stylistic Issues
        "array-bracket-spacing": ["error", "always"],
        "block-spacing": ["error", "always"],
        "brace-style": ["error", "1tbs", {
            "allowSingleLine": true,
        }],
        "camelcase": ["error", {
            "properties": "always",
        }],
        "comma-dangle": ["error", "always-multiline"],
        "comma-spacing": ["error", {
            "before": false,
            "after": true,
        }],
        "comma-style": ["error", "last"],
        //"computed-property-spacing"
        //"consistent-this"
        //"eol-last"
        //"func-names"
        //"func-style"
        //"id-blacklist"
        //"id-length"
        //"id-match"
        //"indent"
        //"jsx-quotes"
        "key-spacing": ["error", {
            "beforeColon": false,
            "afterColon": true,
            "mode": "minimum",
        }],
        "keyword-spacing": ["error", {
            "before": true,
            "after": true,
        }],
        "space-before-blocks": ["error", "always"],
        "brace-style": ["error", "1tbs"],
    },
};
