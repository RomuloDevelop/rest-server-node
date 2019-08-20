const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const login = express.Router();

login.route('/')
.post((req, res)=>{
    let body = req.body;
    const {email, password} = body;
    User.findOne({email}, (err, userDB)=>{
        if(err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!userDB) {
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario o contraseña incorrecto'
                }
            });
        }
        if(!bcrypt.compareSync(password, userDB.password)){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario o contraseña incorrecto'
                }
            });
        }
        const token = jwt.sign(
            { user: userDB }, 
            process.env.SECRET_TOKEN, 
            { expiresIn: process.env.EXPIRE_TOKEN });
        res.json({
            ok:true,
            usuario: userDB,
            token
        })
    })
})

module.exports = login;