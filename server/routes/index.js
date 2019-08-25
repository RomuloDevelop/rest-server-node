const {verifingToken, verifingAdminRole} = require('../middlewares/authentication');
const users = require('./users');
const categories = require('./categories');
const product = require('./product');
const login = require('./login');
const express = require('express');
const routes = express();

routes.use('/api/usuario', [verifingToken, verifingAdminRole], users);
routes.use('/api/categoria', [verifingToken], categories);
routes.use('/api/producto', [verifingToken], product);
routes.use('/api/login', login);

module.exports = routes;