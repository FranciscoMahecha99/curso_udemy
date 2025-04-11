import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import router from './router';
import * as dotenv from 'dotenv';
dotenv.config();

//CONEXION A LA BASE DE DATOS
mongoose.Promise = global.Promise;
const dbUrl = "mongodb://localhost:27017/cursos_udemy";
mongoose.connect(dbUrl, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(mongoose => console.log('Conectado a la base de datos'))
.catch(err => console.log(err));

const app= express();
app.use(cors());

app.use(express.json());//Manejar datos json
app.use(express.urlencoded({extended:true}));//Manejar datos de formularios
app.use(express.static(path.join(__dirname, 'public')));//Acceder a la carpeta public
app.use('/api', router);//Rutas

app.set('port', process.env.PORT || 3000);//Habilitar Puerto

app.listen(app.get('port'), () => {
    console.log('Servidor en puerto 3000');
});