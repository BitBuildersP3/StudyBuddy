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
      next: response => {
        this.authenticationError = false;
        if (!this.router.getCurrentNavigation()) {
          this.refreshService.refresh();
          // There were no routing during login (eg from navigationToStoredUrl)
          this.router.navigate(['landing']);
        }
      },
      error: response => {
        this.authenticationError = true;
        if (response.status == 401) {
          Swal.fire({
            icon: 'error',
            html: '<h2>El usuario está desactivado</h2> <b> Por favor activalo con tu correo o comunicate con <a style="color:deepskyblue" target="_blank" href="https://mail.google.com/mail/?view=cm&fs=1&to=bitbuildersp3@gmail.com&subject=Solicitud%20de%20información">nosotros</a></b>',
            showConfirmButton: true,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Usuario o Contraseña incorrecta',
            showConfirmButton: true,
          });
        }
      },
    });
  }
}
