//verifica si el usuario es autenticado y acceder a la ruta
//Proteccion de las rutas

import token from './token';


export default {

    verifyTienda : async (req, res, next) => {
        if(!req.headers.token){
            res.status(404).send({
                message: 'No se envio el token'
            });
        }
        const response = await token.decode(req.headers.token);//Decodificar el token
        if(response){
            if(response.rol == 'cliente' || response.rol == 'admin'){
                next();
            }else {
                res.status(403).send({
                    message: 'No esta permitido visitar esta pagina'
                });
            }
        }else {
            res.status(403).send({
                message: 'El token es invalido'
            });
        }
    },

    verifyAdmin : async (req, res, next) => {
        if(!req.headers.token){
            res.status(404).send({
                message: 'No se envio el token'
            });
        }
        const response = await token.decode(req.headers.token);//Decodificar el token
        if(response){
            if(response.rol == 'admin'){
                next();
            }else {
                res.status(403).send({
                    message: 'No esta permitido visitar esta pagina'
                });
            }
        }else {
            res.status(403).send({
                message: 'El token es invalido'
            });
        }
    }
}