const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const login = express.Router();
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//Google Configurations
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

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

login.route('/google')
.post(async (req, res)=>{
    console.log('google signIn')
    const token = req.body.idToken;
    let googleUser = await verify(token)
        .catch(err=>{
            console.log(err)
            return res.status(403).json({
                ok: false,
                err
            })
        });

    User.findOne({email:googleUser.email}, (err, userDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(userDB) {
            if(userDB.google === false) {
                return res.status(401).json({
                    ok:false,
                    err: {
                        message: "Debe autenticarse de forma normal"
                    }
                });
            } else {
                const token = jwt.sign(
                    { user: userDB }, 
                    process.env.SECRET_TOKEN, 
                    { expiresIn: process.env.EXPIRE_TOKEN });
                return res.json({
                    ok:true,
                    message: "Token renovado",
                    usuario: userDB,
                    token
                });
            }
        } else {
            // Si usuario no existe en base de datos
            let user = new User();

            user.nombre = googleUser.nombre;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';
            user.save((err, userDB)=>{
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                
                const token = jwt.sign(
                    { user: userDB }, 
                    process.env.SECRET_TOKEN, 
                    { expiresIn: process.env.EXPIRE_TOKEN });
                return res.json({
                    ok:true,
                    usuario: userDB,
                    token
                });
            })
        }

    })
    // res.json({
    //     user: googleUser
    // })
})

module.exports = login;