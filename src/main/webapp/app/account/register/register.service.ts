import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {from, Observable} from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration } from './register.model';


// import { ExtraUserInfoService } from '../service/extra-user-info.service';
// Importo la interface de extra-user-info.model.ts
import { IExtraUserInfo } from 'app/entities/extra-user-info/extra-user-info.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  save(registration: Registration): Observable<{}> {

    console.log("Objeto registration: " + registration);
   const userRegistration = this.extractUser(registration);
    console.log("Objeto registration: " + userRegistration);

    // Make me a get request that returns me the id of the user that I just created.

    // this.http.get(this.applicationConfigService.getEndpointFor('api/register'), userRegistration)
    return this.http.post(this.applicationConfigService.getEndpointFor('api/register'), userRegistration);
  }


// Extrae en un objeto, los datos para el usuario base.
   extractUser(registration: Registration): object {
    const { login, email, password, langKey } = registration;
    return { login: login, email: email, password: password, langKey: langKey };
  }
/*
  extractExtraUserInfo(registration: Registration): object {

    this.http.get(this.applicationConfigService.getEndpointFor('api/register'), registration);



    const phone = registration.phone;
    const degree = registration.degree;
    const birthDay = registration.birthDay;

    return { newExtraInfo };
  } */
}

/*
  Id: number;
  phone?: string | null;
  degree?: string | null;
  profilePicture?: string | null;
  birthDay?: dayjs.Dayjs | null;
  score?: number | null;
  userVotes?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
 */
