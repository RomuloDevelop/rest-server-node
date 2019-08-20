const {verifingToken, verifingAdminRole} = require('../middlewares/authentication');
const users = require('./users');
const login = require('./login');
const express = require('express');
const routes = express();

routes.use('/api/usuario', [verifingToken, verifingAdminRole], users);
routes.use('/api/login', login);

module.exports = routes;