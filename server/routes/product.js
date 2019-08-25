const _ = require('underscore');
const express = require('express');
const Product = require('../models/product');
const products = express.Router();

products.route('/')
    .get((req, res)=>{
        let from = req.query.from || 0;
        let limit = req.query.limit || 0;
        limit = Number(limit);
        from = Number(from);
        Product.find({available:true})
        .skip(from)
        .limit(limit)
        .sort('name')
        .populate('category', 'description')
        .populate('user', 'nombre email')
        .exec((err, productDB)=>{
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                })
            } else {
                res.json({
                    ok: true,
                    product: productDB
                })
            }
        });
    })
    .post((req, res)=>{
        const {body} = req;
        const product = new Product({
            name: body.name,
            price: body.price,
            description: body.description,
            available: body.available,
            category: body.category,
            user: req.user._id
        });
        product.save((err, productDB)=>{
            if(err){
                res.status(400).json({
                    ok: false,
                    err
                })
            } else {
                res.json({
                    ok: true,
                    message: "Producto creado con éxito",
                    product: productDB
                })
            }
        })
    })

products.route('/buscar/:termino')
    .get((req, res)=>{
        let termino = new RegExp(req.params.termino, 'i');
        let from = req.query.from || 0;
        let limit = req.query.limit || 0;
        limit = Number(limit);
        from = Number(from);
        Product.find({name: termino})
        .skip(from)
        .limit(limit)
        .sort('name')
        .populate('category', 'description')
        .populate('user', 'nombre email')
        .exec((err, productDB)=>{
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                })
            } else {
                res.json({
                    ok: true,
                    product: productDB
                })
            }
        })
    })

products.route('/:id')
    .get((req, res)=>{
        const id = req.params.id;
        Product.findById(id)
        .populate('category', 'description')
        .populate('user', 'nombre email')
        .exec((err, productDB)=>{
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                })
            } else {
                if(!productDB){
                    res.status(400).json({
                        ok: false,
                        message: 'No se encontró el producto'
                    })
                } else {
                    res.json({
                        ok: true,
                        product: productDB
                    });
                }
            }
        });
        
    })
    .put((req, res)=>{
        const id = req.params.id;
        const {body} = req;
        const query ={
            name: body.name,
            price: body.price,
            description: body.description,
            available: body.available,
            category: body.category,
            user: req.user._id
        }
        Product.findByIdAndUpdate(id,query,{ 
            new:true,
            runValidators: true,
            context:'query'
        },(err, productDB)=>{
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                })
            } else {
                if(!productDB){
                    res.status(400).json({
                        ok: false,
                        message: 'No se encontró el producto'
                    })
                } else {
                    res.json({
                        ok: true,
                        category: productDB
                    });
                }
            }
        });
    })
    .delete((req, res)=>{
        const id = req.params.id;
        Product.findByIdAndUpdate(id,{available:false},(err, productDB)=>{
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                })
            } else {
                if(!productDB){
                    res.status(400).json({
                        ok: false,
                        message: 'No se encontró el producto'
                    })
                } else {
                    res.json({
                        ok: true,
                        message: 'Producto eliminado con exito',
                        category: productDB
                    });
                }
            }
        });
    });

module.exports = products;