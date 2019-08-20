process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

process.env.EXPIRE_TOKEN = 60 * 60 * 24 * 30;

process.env.SECRET_TOKEN = process.env.SECRET_TOKEN || 'key-desarrollo';

let urlDB;

if(process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else 
    urlDB = process.env.MONGO_URI;

process.env.URLDB = urlDB;

