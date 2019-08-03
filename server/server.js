require('./config/config');
const express = require('express');
const app = express();

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json);

//Routes
app.get('/usuario', (req, res)=>{
    res.json('get Usuario');
});

app.post('/usuario', (req, res)=>{
    let body = request.body;

    if(body.nombre === undefined){
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({persona:body});
    }

});

app.put('/usuario/:id', (req, res)=>{
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', (req, res)=>{
    res.json('delete Usuario');
});

app.listen(process.env.PORT, ()=>{
    console.log('Escuchando puerto', 3000)
});