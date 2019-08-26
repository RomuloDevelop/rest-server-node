const express = require('express');
const fileUpload = require('express-fileupload');
const User = require('../models/users');
const Product = require('../models/product');
const uploads = express.Router();

const path = require('path')
const fs = require('fs');

uploads.use(fileUpload({ useTempFiles: true }));

uploads.route('/:type/:id')
    .put((req, res)=>{
        let {type, id} = req.params;
        if (Object.keys(req.files).length == 0) {
            return res.status(400).json({
                ok:true,
                err:{
                    message:'No se ha seleccionado ningun archivo'
                }
            });
        }
        
          // Validate type  
          const validTypes = ['products', 'users'];
          if(validTypes.indexOf(type) < 0){
            return res.status(400).json({
                ok: false,
                message: `Los tipos de archivos validos son son: ${validTypes.join(', ')}`,
                actual_type: type
            });
        }
        // Validar extension
        let file = req.files.file;
        const fileNameSplit = file.name.split('.');
        const extension = fileNameSplit[fileNameSplit.length -1];
        const validExtensions = ['png', 'gif', 'jpg', 'jpeg'];

        if(validExtensions.indexOf(extension) < 0){
            return res.status(400).json({
                ok: false,
                message: `Las extenciones validas son: ${validExtensions.join(', ')}`,
                ext: extension
            });
        }

        //Change file name
        let fileName = `${id}-${new Date().getTime()}.${extension}`

        file.mv(`uploads/${type}/${fileName}`, (err) => {
          if (err)
            return res.status(500).json({
                ok: false,
                err
            });
    
          saveFileDB(id, type, fileName, res);
        });
    });
    
    function saveFileDB(id, type, name, res){
        let dataName = (type==='products')?'product':'user';
        let Collection = (type==='products')?Product:User;
        Collection.findByIdAndUpdate(id,{img:name},(err, data)=>{
            if (err){
                deleteFile(type, name);                
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!data){
                deleteFile(type, name);
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: `No se encontro el ${(type==='products')?'producto':'usuario'}`
                    }
                });
            }
            deleteFile(type, data.img);
            return res.json({
                ok: true,
                [dataName]:data,
                img: name
            });
            
            
        })
    }

    function deleteFile(type, name){
        const filePath = path.resolve(__dirname, `../../uploads/${type}/${name}`);
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }
    }

    module.exports = uploads;