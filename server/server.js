require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const app = express();

const PORT = process.env.PORT;

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Routes
app.use(routes);

//Database
mongoose.connect(process.env.URLDB,
{useNewUrlParser:true, useCreateIndex:true},
(err)=>{
    if(err) throw err;
    console.log(`BD online: ${process.env.URLDB}`);
});

app.get('/', (req, res)=>{
    res.send('Hello');
});

app.listen(PORT, ()=>{
    console.log('Escuchando puerto', PORT);
});