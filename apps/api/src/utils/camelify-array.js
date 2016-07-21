const camelifyObject = require("./camelify-object");
module.exports = (arr) => {
    for (let i=0, length = arr.length; i < length; i++) {
        arr[i] = camelifyObject(arr[i]);
    }
    return arr;
};
