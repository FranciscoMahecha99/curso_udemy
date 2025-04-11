import routerx from 'express-promise-router';
import userController from '../controllers/UserController.js';
import auth from '../service/auth';

import multiparty from 'connect-multiparty';

var path = multiparty({uploadDir: './uploads/user'});//ruta donde se guardaran las imagenes

const router = routerx();//creacion de una instancia de tipo ruta

//,auth.verifyAdmin
router.post('/register', userController.register);//ruta para registrar un usuario
router.post('/login_tienda', userController.login); //ruta para loguear un usuario
router.post('/login_admin', userController.login_admin);

//CRUD DEL ADMIN
router.post('/register_admin',path, userController.register_admin);//ruta para registrar un usuario
router.post('/update',path, userController.update);//ruta para actualizar un usuario
router.get('/list', userController.list);//ruta para listar los usuarios
router.delete('/delete:id', userController.remove);//ruta para eliminar un usuario
router.get("imagen-usuario/:img", userController.get_imagen);

export default router;//exporta la ruta