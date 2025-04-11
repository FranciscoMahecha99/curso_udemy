import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersAddComponent } from '../users-add/users-add.component';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  USERS:any = [];
  isLoading:any;
  constructor(
    public modalService: NgbModal,
    public userService: UsersService,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.userService.isLoading$;
    this.userService.listUsers().subscribe((resp: any)=>{
      console.log(resp);
      this.USERS = resp.users;
    })
  }

  registerUser(){

    const modalRef = this.modalService.open(UsersAddComponent,{centered:true, size: 'md'});// para abrir el modal
  }
}
