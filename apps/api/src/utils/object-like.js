module.exports = function objectLike(obj, comparators) {
    for (let i = 0, L = comparators.length; i < L; i++) {
        if (!comparators[i].propertyName) {
            throw new Error("No propertyName defined for comparator");
        }
        if (!{}.hasOwnProperty.call(obj, comparators[i].propertyName)) {
            return false;
        }
        if (comparators[i].comparisonValue && obj[comparators[i].propertyName] !== comparators[i].comparisonValue) {
            return false;
        }
        if (comparators[i].nonNull && !obj[comparators[i].propertyName]) {
            return false;
        }
    }
    return true;
};
