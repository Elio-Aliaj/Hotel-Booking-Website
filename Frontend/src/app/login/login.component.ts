import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../sevices/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private _dataService: DataService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  login() {
    this.http
      .post<any>('http://localhost:3000/Login', this.loginForm.value, {
        withCredentials: true,
      })
      .subscribe(
        (res) => {
          this.loginForm.reset();

          if (res.role === 'admin') {
            this.router.navigate(['dashBoard']);
          } else if (res.role === 'user') {
            this.router.navigate(['roomList']);
          }
        },
        (err) => {
          console.log(err);
          alert(err.error);
        }
      );
  }
}
