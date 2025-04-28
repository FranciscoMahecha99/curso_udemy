import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit {

  @Input() USER: any; // Usuario a editar
  @Output() UserE : EventEmitter<any> = new EventEmitter()// Emitimos el usuario creado

  rol: string = 'admin';
  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  profession: string = '';
  description: string = '';

  FILE_AVATAR: any;
  IMAGEN_PREVISUALIZAR: any = 'assets/media/avatars/300-6.jpg';
  constructor(
    public userService: UsersService, // Servicio de usuarios
    public toaster : Toaster, // Para las alertas
    public modal : NgbActiveModal, // Para el modal
  ) { }

  ngOnInit(): void {
    this.rol = this.USER.rol;
    this.name = this.USER.name;
    this.surname = this.USER.surname;
    this.email = this.USER.email;
    this.profession = this.USER.profession;
    this.description = this.USER.description;
    this.IMAGEN_PREVISUALIZAR = this.USER.avatar; // Asignamos la imagen del usuario a la variable IMAGEN_PREVISUALIZAR
  }

  proceesAvatar($event: any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toaster.open({text: 'El archivo seleccionado no es una imagen',caption: 'VALIDACIONES', type: 'danger'}); // Alerta de error
      return;
    }

    this.FILE_AVATAR = $event.target.files[0]; // Asignamos el archivo a la variable FILE_AVATAR
    let reader = new FileReader(); // Creamos un objeto de la clase FileReader
    reader.readAsDataURL(this.FILE_AVATAR); // Leemos el archivo
    reader.onloadend = () => this.IMAGEN_PREVISUALIZAR = reader.result; // Cuando termina de cargar la imagen, la asignamos a la variable IMAGEN_PREVISUALIZAR
  }

  save(){
    if(!this.name  || !this.surname || !this.email   ){
      this.toaster.open({text: 'Todos los campos son obligatorios',caption: 'VALIDACIONES', type: 'danger'}); // Alerta de error
      return;
    }
    let formData = new FormData();
    formData.append('_id', this.USER._id); // Agregamos el id del usuario a editar
    if(this.FILE_AVATAR){
      formData.append('avatar', this.FILE_AVATAR);
    }
    formData.append('name', this.name);
    formData.append('surname', this.surname);
    formData.append('email', this.email);
    if(this.password){
      formData.append('password', this.password);
    }
    formData.append('rol', this.rol);
    if(this.profession){
      formData.append('profession', this.profession);
    }
    if(this.description){
      formData.append('description', this.description);
    }

    this.userService.update(formData).subscribe((resp: any)=>{
      console.log(resp);
      this.UserE.emit(resp.user); // Emitimos el usuario creado
      this.modal.close(); // Cerramos el modal
      this.toaster.open({text: 'Se edito el usuario seleccionado',caption: 'VALIDACIONES', type: 'primary'});
    })
  }

}
