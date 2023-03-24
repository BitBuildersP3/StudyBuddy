import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { LANGUAGES } from 'app/config/language.constants';
import { ExtraUserInfoService } from 'app/entities/extra-user-info/service/extra-user-info.service';

const initialAccount: any = {} as Account;

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  success = false;
  languages = LANGUAGES;

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
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),

    activated: new FormControl(initialAccount.activated, { nonNullable: true }),
    authorities: new FormControl(initialAccount.authorities, { nonNullable: true }),
    imageUrl: new FormControl(initialAccount.imageUrl, { nonNullable: true }),
    login: new FormControl(initialAccount.login, { nonNullable: true }),
  });

  constructor(
    private accountService: AccountService,
    private translateService: TranslateService,
    private extraInfoService: ExtraUserInfoService
  ) {}

  ngOnInit(): void {
    this.extraInfoService.getInfoByCurrentUser().subscribe(data => {
      this.accountService.identity().subscribe(account => {
        if (account) {
          const customForm = { ...account, ...data.body };

          this.settingsForm.patchValue(customForm);
        }
      });
    });
  }

  save(): void {
    this.success = false;

    const response = this.settingsForm.getRawValue();

    const extraInfo = {
      id: response.id,
      birthday: response.birthDay,
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
    // eslint-disable-next-line no-console
    console.log(extraInfo);

    // eslint-disable-next-line no-console
    console.log(account);

    this.accountService.save(response).subscribe(() => {
      this.success = true;

      this.accountService.authenticate(account);

      if (account.langKey !== this.translateService.currentLang) {
        this.translateService.use(account.langKey);
      }
    });

    this.extraInfoService.partialUpdate(extraInfo).subscribe(() => {
      this.success = true;
    });
  }
}
