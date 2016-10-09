/* eslint-disable  global-require */

module.exports = {
    middlewares: [
        "responseTimer",
        //"cors",
        "requestIdentifier",
    ],
    routes: [
        require("./routes/grocery-lists"),
        require("./routes/categories"),
        require("./routes/quantity-types"),
        require("./routes/login"),
        require("./routes/signup"),
        require("./routes/households"),
        require("./routes/users"),
        require("./routes/items"),
    ],
};
