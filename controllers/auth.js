const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: true,
                msg: 'Un usuario existe con ese correo',
            });
        }

        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name, usuario.typeU, usuario.email, usuario.direction, usuario.number);


        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name : usuario.name,
            typeU: usuario.typeU,
            email: usuario.email,
            direction: usuario.direction,
            number: usuario.number,
            token
        });

    } catch (erorr) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }

}

const iniciarUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                ok: true,
                msg: 'El usuario no existe con ese email',
            });
        }

        //Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: true,
                msg: 'Password incorrecto',
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name, usuario.typeU, usuario.email, usuario.direction, usuario.number);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            typeU: usuario.typeU,
            email: usuario.email,
            direction: usuario.direction,
            number: usuario.number,
            token
        })

        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }
}

const revalidarToken = async (req, res = response) => {

    const {uid, name, typeU, email, number, direction} = req;

    //generar nuevo token
    const token = await generarJWT(uid, name, typeU, email, number, direction);
    res.json({
        ok: true,   
        name,
        uid,
        typeU,
        email,
        number,
        direction,
        token
        
    })
}

module.exports = {
    crearUsuario,
    revalidarToken,
    iniciarUsuario
}