import { Component, OnInit } from '@angular/core';
import { DataService } from '../../sevices/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users: any;

  constructor(private router: Router, private _dataService: DataService) {}

  ngOnInit(): void {
    this._dataService.usersData().subscribe(
      (res: any) => {
        this.users = res.users;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  deleteUser(id: any, i: number) {
    if (confirm('Are you sure you want to delete? ⚠️')) {
      this._dataService.deleteUser(id).subscribe(
        (res: any) => {
          this.users.splice(i, 1);
          alert(res.message);
        },
        (error) => console.error('Error deleting room', error)
      );
    } else {
      alert('Canceled');
    }
  }
  editUser(username: any) {
    this.router.navigate(['dashBoard/editField', username]);
  }
}
