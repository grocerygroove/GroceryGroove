const makeParameterManager = function () {
    const parameterManager = {
        offset: 1,
        values: [],

        generate: (() => `$${ parameterManager.offset++ }`),
        pushValue: (value => parameterManager.values.push(value)),

        save: function (value) {
            const placeholder = parameterManager.generate();
            parameterManager.pushValue(value);

            return placeholder;
        },
    };

    return parameterManager;
};

module.exports = makeParameterManager;
