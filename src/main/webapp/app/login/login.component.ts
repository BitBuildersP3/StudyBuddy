import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { NavbarComponent } from '../layouts/navbar/navbar.component';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';

import { RefreshService } from '../shared/refresh-service.service';
@Component({
  selector: 'jhi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('username', { static: false })
  username!: ElementRef;

  authenticationError = false;

  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private router: Router,
    private titleService: Title,
    private refreshService: RefreshService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Página de Acceso');

    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate(['']);
      }
    });
  }

  ngAfterViewInit(): void {
    this.username.nativeElement.focus();
  }

  login(): void {
    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.authenticationError = false;
        if (!this.router.getCurrentNavigation()) {
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            showConfirmButton: false,
            timer: 2000,
          });

          this.refreshService.refresh();
          // There were no routing during login (eg from navigationToStoredUrl)
          this.router.navigate(['landing']);
        }
      },
      error: () => (this.authenticationError = true),
    });
  }
}
