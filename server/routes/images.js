const express = require('express');
const images = express.Router();

const path = require('path')
const fs = require('fs');


images.route('/:type/:img')
    .get((req, res)=>{
        const {type, img} = req.params;
        const pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`);
        if(fs.existsSync(pathImg)){
            res.sendFile(pathImg);
        } else{
            const noImagePath = path.resolve(__dirname,'../assets/no-image.jpg');
            res.sendFile(noImagePath);
        }
    })

module.exports = images;