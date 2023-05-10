const jwt = require('jsonwebtoken');

const generarJWT = ( uid, name, typeU, email) => {

    return new Promise( (resolve, reject) => {
        const payload = { uid, name, typeU, email};
        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (err, token) => {
            if (err){
                console.log(err);
                reject('No se pudo generar el token');
            }
            resolve(token);
        })
    })

}

module.exports = {
    generarJWT
}