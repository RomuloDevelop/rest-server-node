const _ = require('underscore');
const express = require('express');
const Category = require('../models/categories');
const categories = express.Router();

categories.route('/')
    .get((req, res)=>{
        Category.find({})
        .sort('description')
        .populate('user', 'nombre email')
        .exec((err, categoriesDB)=>{
            if(err){
                res.status(400).json({
                    ok: false,
                    err
                })
            } else {
                res.json({
                    ok: true,
                    categories: categoriesDB
                })
            }

        });
    })
    .post((req, res)=>{
        const {body} = req;
        const category = new Category({
            user: req.user._id,
            description: body.description
        });
        category.save((err, categoryDB)=>{
            if(err){
                res.status(400).json({
                    ok: false,
                    err
                })
            } else {
                res.json({
                    ok: true,
                    message: "Categoría creada con éxito",
                    category: categoryDB
                })
            }
        });
    });

categories.route('/:id')
    .get((req, res)=>{
        const id = req.params.id;
        Category.findById(id,(err, categoryDB)=>{
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                })
            } else {
                if(!categoryDB){
                    res.status(400).json({
                        ok: false,
                        message: 'No se encontró la categoria'
                    })
                } else {
                    res.json({
                        ok: true,
                        category: categoryDB
                    });
                }
            }
        });
    })
    .put((req, res)=>{
        const id = req.params.id;
        const {body} = req;
        const query ={description: body.description, user:req.user._id}
        Category.findByIdAndUpdate(id,query,{ 
            new:true,
            runValidators: true,
            context:'query'
        },(err, categoryDB)=>{
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                })
            } else {
                if(!categoryDB){
                    res.json({
                        ok: false,
                        message: 'No se encontró la categoria'
                    })
                } else {
                    res.json({
                        ok: true,
                        category: categoryDB
                    });
                }
            }
        });
    })
    .delete((req, res)=>{
        const id = req.params.id;
        Category.findByIdAndDelete(id,(err, categoryDB)=>{
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                })
            } else {
                if(!categoryDB){
                    res.json({
                        ok: false,
                        message: 'No se encontró la categoria'
                    })
                } else {
                    res.json({
                        ok: true,
                        message: 'Categoría eliminada con éxito',
                        category: categoryDB
                    });
                }
            }
        });
    });

module.exports = categories;