import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';

import { VERSION } from 'app/app.constants';
import { LANGUAGES } from 'app/config/language.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import Swal from 'sweetalert2';
import {
  EntityResponseType,
  ExtraUserInfoService,
  PartialUpdateExtraUserInfo,
} from '../../entities/extra-user-info/service/extra-user-info.service';
import { RefreshService } from '../../shared/refresh-service.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  profileImg: string | null | undefined = `https://res.cloudinary.com/dwxpyowvn/image/upload/v1679364359/cld-sample.jpg`;
  partialExtraUserInfo: PartialUpdateExtraUserInfo = { id: 0, profilePicture: '' };
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  entitiesNavbarItems: any[] = [];
  isOpenForo = false;

  isOpenPomodoro = false;
  safeUrl: any = '';
  constructor(
    private loginService: LoginService,
    private translateService: TranslateService,
    private sessionStorageService: SessionStorageService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router,
    private extraUserInfoService: ExtraUserInfoService,
    private refreshService: RefreshService,
    private sanitizer: DomSanitizer
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.refreshService.refresh$.subscribe(() => {
      this.updateUserData();
    });

    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });

    this.updateUserData();
  }

  sanitizeUrl(): void {
    const dirtyUrl: any = `https://deadsimplechat.com/w3dGDjW9b?username=${this.account?.login}`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dirtyUrl);
  }

  setOpenForo(): void {
    this.sanitizeUrl();
    this.isOpenForo = !this.isOpenForo;
  }

  setOpenPomodoro(): void {
    this.sanitizeUrl();
    this.isOpenPomodoro = !this.isOpenPomodoro;
  }
  updateUserData() {
    this.extraUserInfoService.getInfoByCurrentUser().subscribe({
      next: (res: EntityResponseType) => {
        // console.log(res);
        this.profileImg = res.body?.profilePicture;
        this.partialExtraUserInfo.id = <number>res.body?.id;
        this.partialExtraUserInfo.profilePicture = <string>res.body?.profilePicture;
      },
    });
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorageService.store('locale', languageKey);
    this.translateService.use(languageKey);
  }
  //this method shows the image
  openModal() {
    Swal.fire({
      title: 'Tu foto de perfil',
      html: `<img src="${this.profileImg}" style="widtd = 20.75em; height: 20.75em"/> `,
    });
  }

  updateProfileImg(url: string) {
    this.partialExtraUserInfo.profilePicture = url;
    this.extraUserInfoService.partialUpdate(this.partialExtraUserInfo).subscribe();
    this.profileImg = url;
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
