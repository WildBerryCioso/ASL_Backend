
/*
    /api/productos
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');
const { obtenerProducto, crearProductos, actualizarProductos, eliminarProductos } = require('../controllers/productos');

const router = new Router();

//Obtener productos
router.get('/', obtenerProducto);

router.use(validarJWT);

//Crear productos
router.post(
    '/',
    [
        check('referencia', 'El titulo es obligatorio').not().isEmpty(),
        check('titulo', 'El titulo es obligatorio').not().isEmpty(),
        check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
        check('precio', 'El precio es obligatoria').not().isEmpty(),
        check('cantidad', 'La cantidad es obligatoria').not().isEmpty(),
        validarCampos
    ],
    crearProductos
);

//Actualizar productos
router.put('/:id', actualizarProductos);

//Eliminar productos
router.delete('/:id', eliminarProductos);

module.exports = router;