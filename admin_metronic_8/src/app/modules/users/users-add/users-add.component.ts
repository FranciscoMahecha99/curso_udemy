import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { UsersService } from '../service/users.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users-add',
  templateUrl: './users-add.component.html',
  styleUrls: ['./users-add.component.scss']
})
export class UsersAddComponent implements OnInit {

  @Output() UserC : EventEmitter<any> = new EventEmitter()// Emitimos el usuario creado

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
    if(!this.name  || !this.surname  || !this.FILE_AVATAR || !this.email  || !this.password   ){
      this.toaster.open({text: 'Todos los campos son obligatorios',caption: 'VALIDACIONES', type: 'danger'}); // Alerta de error
      return;
    }
    let formData = new FormData();
    formData.append('avatar', this.FILE_AVATAR);
    formData.append('name', this.name);
    formData.append('surname', this.surname);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('rol', this.rol);
    formData.append('profession', this.profession);
    formData.append('description', this.description);

    this.userService.register(formData).subscribe((resp: any)=>{
      console.log(resp);
      this.UserC.emit(resp.user); // Emitimos el usuario creado
      this.modal.close(); // Cerramos el modal
      this.toaster.open({text: 'Se registro un nuevo usuario',caption: 'VALIDACIONES', type: 'primary'});
    })
  }
}
