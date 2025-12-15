const Joi = require("joi");
const query = require("../models/db-users-models")
const uuid = require("uuid")
const bcrypt = require("bcrypt");
const _ = require('lodash');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// These codes receive the user information and perform authentication on them. If the information is correct,
//  a new user is created and finally a JSON web token is assigned to the
//  user through the header for authorization and user management.
//  In case of any error, they return the desired error to the user.
const registry = async (req, res) => {
    const schema = {
        fullname: Joi.string().min(4).max(40).required(),
        username: Joi.string().min(4).max(40).required(),
        email: Joi.string().email().required(),
        pwd: Joi.string().min(8).max(50).required()
    }

    const validata = Joi.object(schema).validate(req.body);

    if (validata.error) return res.status(400).send(validata.error.message);

    const hashPwd = await bcrypt.hash(req.body.pwd, 10).catch(e => res.status(500).send("Error"));

    await query.addUser(uuid.v4(), req.body.fullname, req.body.username, req.body.email, hashPwd)
        .catch(e => res.status(400).send(e.sqlMessage));

    const [selectUserData] = await query.selectUser(req.body.email).catch(e => res.status(500).send("Error retrieving user information."));

    const welcomeMessage = _.pick(selectUserData, ["FullName", "UserName", "Email"]);

    const token = jwt.sign(_.pick(selectUserData, ['id']), process.env.SECRET_KEY);

    res.setHeader("Authentication", token).send(`User add \n Your firstname is ${welcomeMessage.FullName} 
        Your username is ${welcomeMessage.UserName} \n Your email is ${welcomeMessage.Email}`);
}

// These codes receive the user's information and perform authentication on them. If an error occurs,
//  they return the desired error to the user. Otherwise, the user is logged in and a JSON web token is
//  assigned to the user in the header to manage and verify user permissions.
const login = async (req, res) => {
    const schema = {
        email: Joi.string().email().required(),
        pwd: Joi.string().min(8).max(40).required()
    }

    const valiData = Joi.object(schema).validate(req.body);

    if (valiData.error) return res.send(valiData.error.name);

    const [select] = await query.selectUser(req.body.email).catch(e => res.send("error select user"));

    if (!select) return res.status(400).send("Email or password is invalid.");

    const checkingThePassword = await bcrypt.compare(req.body.pwd, String(select.Pwd))
        .catch(error => { res.send("Data required"); console.log(error) });

    if (!checkingThePassword) return res.status(400).send("Email or password is invalid.");

    const welcomeMessage = _.pick(select, ["FullName", "UserName", "Email"]);

    const token = jwt.sign(_.pick(select, ['id']), process.env.SECRET_KEY);

    res.header("Authentication", token).send(`Login \n Your firstname is ${welcomeMessage.FullName} 
        Your username is ${welcomeMessage.UserName} \n Your email is ${welcomeMessage.Email}`);
}

module.exports = { registry, login }