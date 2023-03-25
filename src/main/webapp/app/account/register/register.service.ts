import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration } from './register.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  save(registration: Registration): Observable<{}> {

    console.log("Objeto registration: " + registration);
   const userRegistration = this.extractUser(registration);
    console.log("Objeto registration: " + userRegistration);
    return this.http.post(this.applicationConfigService.getEndpointFor('api/register'), userRegistration);
  }


// Extrae en un objeto, los datos para el usuario base.
   extractUser(registration: Registration): object {
    const { login, email, password, langKey } = registration;
    return { login: login, email: email, password: password, langKey: langKey };
  }
}
