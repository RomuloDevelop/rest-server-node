const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/users');
const users = express.Router();

users.route('/')
.get((req, res)=>{

    let from = req.query.from || 0;
    let limit = req.query.limit || 5;
    from = Number(from);
    limit = Number(limit);

    User.find({state:true}, 'nombre email role google')
    .skip(from)
    .limit(limit)
    .exec((err, users)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        User.count({state:true},(err, count)=>{
            res.json({
                ok:true,
                users,
                count
            })

        })

    });
})
.post((req, res)=>{
    let body = req.body;
    let user = new User({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    user.save((err, userDB)=>{
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok:true,
            user: userDB
        })
    });
})

users.route('/:id')
.put((req, res)=>{
    let id = req.params.id;
    let body = _.pick(req.body,['nombre','email','img','role','state']);

    User.findByIdAndUpdate(id, body,{ 
        new:true,
        runValidators: true 
    }, (err, userDB)=>{
        if(err){

            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok:true,
            user: userDB
        });
    })

})
.delete((req, res)=>{
    let id = req.params.id;

    //User.findByIdAndRemove(id, (err, user)=>{
    User.findByIdAndUpdate(id,{state:false}, (err, user)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(!user){
            return res.status(400).json({
                ok: false,
                err:{
                    message:'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok:true,
            user
        });

    })
});

module.exports = users;