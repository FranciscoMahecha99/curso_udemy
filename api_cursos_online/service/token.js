import jwt from 'jsonwebtoken';
import models from '../models';

export default {
    //Generar el token
    encode:async (_id, rol,email) =>{
        const token = jwt.sign({
            _id: _id,rol:rol,email:email
        },"courses_udemy",{expiresIn: '1d'});//1 dia

        return token;
    },
    //decodificar token
    decode:async (token) => {
        try {
            const {_id} = await jwt.verify(token, "courses_udemy");//Verifica que el token sea valido
            const user = await models.User.findOne({_id: _id});//Busca el usuario en la base de datos
            if(user){
                return user;
            }
                return false;
            
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}