import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { LANGUAGES } from 'app/config/language.constants';
import { ExtraUserInfoService } from 'app/entities/extra-user-info/service/extra-user-info.service';
import Swal from 'sweetalert2';
import { EntityResponseType, PartialUpdateExtraUserInfo } from '../../entities/extra-user-info/service/extra-user-info.service';
import { Title } from '@angular/platform-browser';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
const initialAccount: any = {} as Account;

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.css'],
})
export class SettingsComponent implements OnInit {
  entitiesNavbarItems: any[] = [];
  success = false;
  languages = LANGUAGES;
  partialExtraUserInfo: PartialUpdateExtraUserInfo = { id: 0, profilePicture: '' };
  defaulImg: string = 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1681166198/default-image_ltck0i.webp';
  profileImg: string | null | undefined = this.defaulImg;
  settingsForm = new FormGroup({
    firstName: new FormControl(initialAccount.firstName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    lastName: new FormControl(initialAccount.lastName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    email: new FormControl(initialAccount.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    langKey: new FormControl(initialAccount.langKey, { nonNullable: true }),
    phone: new FormControl(initialAccount.phone, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    degree: new FormControl(initialAccount.degree, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    birthDay: new FormControl(initialAccount.birthDay, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    id: new FormControl(initialAccount.id, {
      nonNullable: true,
    }),

    activated: new FormControl(initialAccount.activated, { nonNullable: true }),
    authorities: new FormControl(initialAccount.authorities, { nonNullable: true }),
    imageUrl: new FormControl(initialAccount.imageUrl, { nonNullable: true }),
    login: new FormControl(initialAccount.login, { nonNullable: true }),
  });

  constructor(
    private accountService: AccountService,
    private translateService: TranslateService,
    private extraInfoService: ExtraUserInfoService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Perfil');
    this.extraInfoService.getInfoByCurrentUser().subscribe(data => {
      this.accountService.identity().subscribe(account => {
        if (account) {
          this.entitiesNavbarItems = EntityNavbarItems;
          const customForm = { ...account, ...data.body };

          this.settingsForm.patchValue(customForm);
          this.extraInfoService.getInfoByCurrentUser().subscribe({
            next: (res: EntityResponseType) => {
              this.profileImg = res.body?.profilePicture;
              this.partialExtraUserInfo.id = <number>res.body?.id;
              this.partialExtraUserInfo.profilePicture = <string>res.body?.profilePicture;
            },
          });
        }
      });
    });
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
    this.extraInfoService.partialUpdate(this.partialExtraUserInfo).subscribe();
    this.profileImg = url;
  }
  save(): void {
    this.success = false;

    const response = this.settingsForm.getRawValue();

    const extraInfo = {
      id: response.id,
      birthDay: response.birthDay,
      degree: response.degree,
      phone: response.phone,
    };

    const account = {
      activated: response.activated,
      authorities: response.authorities,
      email: response.email,
      firstName: response.firstName,
      langKey: response.langKey,
      lastName: response.lastName,
      login: response.login,
    };

    this.accountService.save(response).subscribe(() => {
      this.success = true;

      this.accountService.authenticate(account);

      if (account.langKey !== this.translateService.currentLang) {
        this.translateService.use(account.langKey);
      }
      Swal.fire({
        icon: 'success',
        title: 'Modificado correctamente',
        showConfirmButton: true,
      });
    });

    this.extraInfoService.partialUpdate(extraInfo).subscribe(() => {
      this.success = true;
    });
  }
}
