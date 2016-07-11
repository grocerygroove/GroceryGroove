module.exports = {
    middlewares: [
        "responseTimer",
        "requestIdentifier",
    ],
    routes: [
        require("./routes/grocery-lists"),
        require("./routes/categories"),
        require("./routes/quantity-types"),
        require("./routes/login"),
        require("./routes/signup"),
    ],
};
