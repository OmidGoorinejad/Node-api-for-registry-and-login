const express = require("express");
const Router = express.Router();
const userContrller = require("../controller/users-controller");

Router.post('/registry', userContrller.registry);
Router.post("/login", userContrller.login);
module.exports = Router;