const jwt = require('jsonwebtoken');
// ===================
//  Verificando Token
// ===================

let verifingToken = (req, res, next) => {
    let [type, token] = req.get('Authorization').split(' ');
    if(type !== 'Bearer'){
        res.status(401).json({
            ok:false,
            err: 'Tipo de autenticacion no soportado'
        })
    }
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded)=>{
        if(err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.user = decoded.user
        next();
    });
}

let verifingAdminRole = (req, res, next) => {
    const {user} = req;
    if(user.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok:false,
            err: 'El usuario no es administrador'
        });
    }
    next();
}

let verifyTokenImg = (req, res, next)=>{
    let {token} = req.query;
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded)=>{
        if(err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.user = decoded.user;
        next();
    });
}

module.exports = {
    verifingToken,
    verifingAdminRole,
    verifyTokenImg
};