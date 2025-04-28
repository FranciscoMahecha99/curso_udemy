import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-users-delete',
  templateUrl: './users-delete.component.html',
  styleUrls: ['./users-delete.component.scss']
})
export class UsersDeleteComponent implements OnInit {

  @Input() USER: any; // Usuario a editar
  @Output() UserD : EventEmitter<any> = new EventEmitter()// Emitimos el usuario creado
  constructor(
        public userService: UsersService, // Servicio de usuarios
        public toaster : Toaster, // Para las alertas
        public modal : NgbActiveModal, // Para el modal
  ) { }

  ngOnInit(): void {
  }

  delete(){
    this.userService.remove(this.USER._id).subscribe((resp: any)=>{
      console.log(resp);
      this.UserD.emit(''); // Emitimos el usuario creado
      this.modal.close(); // Cerramos el modal
      this.toaster.open({text: 'se elimino el usuario',caption: 'VALIDACIONES', type: 'primary'});
    })
  }

}
