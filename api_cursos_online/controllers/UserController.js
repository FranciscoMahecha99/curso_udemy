import models from '../models';//importa el modelo de la base de datos
import bcrypt from 'bcrypt';
import token from '../service/token';
import fs from 'fs';
import path from 'path';
import resource from '../resource';//importa el recurso de usuario

export default {
    register : async (req,res) => {
        try {

            const VALID_USER = await models.User.findOne({email: req.body.email});//busca un usuario con el correo ingresado

            if(VALID_USER){
                res.status(200).send({
                    message: 403,
                    message_text: 'El correo ya esta registrado'
                });
            }

            //Encriptacion de contraseña
            req.body.password = await bcrypt.hash(req.body.password,10);//encripta la contraseña
            const User = await models.User.create(req.body);//creacion de un usuario con lo que recibe en el cuerpo de la solicitud
            res.status(200).json({
                user: User
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Ocurrio un problema'
            });
        }
    },

    login: async (req,res) => {
        try {
            const user = await models.User.findOne({
                email: req.body.email,
                state: 1
            })
            if(user){
                //Comparacion de contraseñas
                let compare = await bcrypt.compare(req.body.password, user.password);//compara la contraseña ingresada con la contraseña encriptada
                if(compare){
                    //Usuario existe y esta activo
                    let tokenT = await token.encode(user._id, user.rol, user.email);//genera el token

                    const USER_BODY = {
                        token: tokenT,
                        user : {
                            name: user.name,
                            surname: user.surname,
                            email: user.email,
                            // avatar: user.avatar,
                        }
                    }
                    res.status(200).json({
                        user: USER_BODY,
                    });
                }else{
                    res.status(500).send({
                        message: 'El usuario ingresado no existe'
                    });
                }
            }else{
                res.status(500).send({
                    message: 'El usuario ingresado no existe'
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Ocurrio un problema'
            });
        }
    },

    login_admin: async (req,res) => {
        try {
            const user = await models.User.findOne({
                email: req.body.email,
                state: 1,
                rol: 'admin'
            })
            if(user){
                //Comparacion de contraseñas
                let compare = await bcrypt.compare(req.body.password, user.password);//compara la contraseña ingresada con la contraseña encriptada
                if(compare){
                    //Usuario existe y esta activo
                    let tokenT = await token.encode(user._id, user.rol, user.email);//genera el token

                    const USER_BODY = {
                        token: tokenT,
                        user : {
                            name: user.name,
                            surname: user.surname,
                            email: user.email,
                            // avatar: user.avatar,
                        }
                    }
                    res.status(200).json({
                        user: USER_BODY,
                    });
                }else{
                    res.status(500).send({
                        message: 'El usuario ingresado no existe'
                    });
                }
            }else{
                res.status(500).send({
                    message: 'El usuario ingresado no existe'
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Ocurrio un problema'
            });
        }
    },

    register_admin: async (req,res) => {
        try {
            
            const VALID_USER = await models.User.findOne({email: req.body.email});//busca un usuario con el correo ingresado

            if(VALID_USER){
                res.status(200).send({
                    message: 403,
                    message_text: 'El correo ya esta registrado'
                });
            }

            //Encriptacion de contraseña
            req.body.password = await bcrypt.hash(req.body.password,10);//encripta la contraseña

            if(req.files && req.files.avatar){
                var img_path = req.files.avatar.path;//ruta de la imagen
                var name = img_path.split('\\');//separa la ruta de la imagen
                var avatar_name = name[2];//nombre de la imagen
                req.body.avatar = avatar_name;//agrega el nombre de la imagen al cuerpo
            }

            const User = await models.User.create(req.body);//creacion de un usuario con lo que recibe en el cuerpo de la solicitud
            res.status(200).json({
                user:resource.User.api_resource_user (User),
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Ocurrio un problema'
            });
            
        }
    },
    
    update: async (req,res) => {
        try {
            
            const VALID_USER = await models.User.findOne({email: req.body.email,_id:{$ne : req.body._id}});//busca un usuario con el correo ingresado _id:{$ne : req.body._id} busca los usuarios donde el id sea diferente al que se esta actualizando

            if(VALID_USER){
                res.status(200).send({
                    message: 403,
                    message_text: 'El correo ya esta registrado'
                });
            }

            if(req.body.password){
                req.body.password = await bcrypt.hash(req.body.password,10);//encripta la contraseña

            }

            if(req.files && req.files.avatar){
                var img_path = req.files.avatar.path;//ruta de la imagen
                var name = img_path.split('\\');//separa la ruta de la imagen
                var avatar_name = name[2];//nombre de la imagen
                req.body.avatar = avatar_name;//agrega el nombre de la imagen al cuerpo
            }

            const User = await models.User.findOneAndUpdate({_id : req.body._id}, req.body);//actualiza un usuario con lo que recibe en el cuerpo de la solicitud
            const NUser = await models.User.findById({_id : req.body._id});//busca el usuario actualizado
            res.status(200).json({
                message: 'Usuario actualizado',
                user: resource.User.api_resource_user (NUser),
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Ocurrio un problema'
            });
            
        }
    },

    list: async (req,res) => {
        try {
            var search = req.query.search;//busca un usuario con el nombre ingresado
            let USERS = await models.User.find({
                $or: [
                    {'name': new RegExp(search, 'i')},//busca el nombre ingresado sin importar si es mayuscula o minuscula
                    {'surname': new RegExp(search, 'i')},//busca el apellido ingresado sin importar si es mayuscula o minuscula
                    {'email': new RegExp(search, 'i')}//busca el correo ingresado sin importar si es mayuscula o minuscula
                ],
                "rol": {$in: ["admin", "instructor"]}//busca los usuarios con rol admin o instructor
            }).sort({'createdAt': -1});//ordena los usuarios por fecha de creacion

            USERS = await USERS.map((user) => {//mapea los usuarios
                console.log(resource.User.api_resource_user(user));
                return resource.User.api_resource_user(user);//retorna el recurso de usuario
            });

            res.status(200).json({
                users: USERS,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Ocurrio un problema'
            });           
        }
    },

    remove: async (req,res) => {
        try {
            let _id = req.params["id"];//id del usuario

            const User = await models.User.findByIdAndDelete({_id: _id});//elimina un usuario con el id ingresado
            res.status(200).json({
                message: 'Usuario eliminado',
            })
            
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Ocurrio un problema'
            });
            
        }
    },

    get_imagen: async (req,res) => {
        try {
            var img = req.params["img"];//nombre de la imagen
            if(!img){
                res.status(500).send({
                    message: 'Ocurrio un problema'
                });
            }else {
                fs.stat('./uploads/user/'+img, function(err){
                    if(!err){
                        let path_img = './uploads/user/'+img;//ruta de la imagen
                        res.status(200).sendFile(path.resolve(path_img));//envia la imagen
                        console.log("problema de imagen");
                    }else {
                        let path_img = './uploads/default.jpg';//ruta de la imagen por defecto
                        res.status(200).sendFile(path.resolve(path_img));//envia la imagen
                    }
                })//busca la imagen en la carpeta
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: 'Ocurrio un problema'
            });
        }
    },

}