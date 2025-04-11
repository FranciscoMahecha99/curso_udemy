import mongoose, {Schema} from 'mongoose';//importamos mongoose y su esquema

const UserSchema = new Schema ({
    rol: {type: String, maxlength: 30, required: true},
    name: {type: String, maxlength: 250,required: true},
    surname: {type: String, maxlength: 250,required: true},
    email: {type: String, maxlength: 250,required: true, unique: true},
    password: {type: String, maxlength: 250,required: true},
    avatar: {type: String, maxlength: 250,required: false},
    state: {type: Number, default: 1},//1 activo, 2 inactivo
    phone: {type: String, maxlength: 30,required: false},
    birthday: {type: String, maxlength: 250,required: false},
    // is_instructor: {type: Number, default: null,required: false},//1 instructor
    
    profession: {type: String, maxlength: 250,required: false},
    description: {type: String,required: false},
},{
    timestamps: true//crea la fecha de creación y actualización
})


//Generamos el modelo

const User = mongoose.model('user', UserSchema);
export default User;