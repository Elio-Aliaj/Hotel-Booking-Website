import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../sevices/data.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  auth: any = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private _dataService: DataService
  ) {}

  ngOnInit(): void {
    this._dataService.authData().subscribe(
      (res: any) => {
        this.auth = res.auth;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  logOut(): void {
    this.http
      .post(
        'http://localhost:3000/Logout',
        {},
        {
          withCredentials: true,
        }
      )
      .subscribe(
        (res) => {
          this.router.navigate(['login']);
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
