import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration } from './register.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}



  save(registration: any): Observable<{}> {
    // Llama al Api de de Usuario y ExtraInfo para meter los datos.
    return this.http.post(this.applicationConfigService.getEndpointFor('api/registerExtra'), registration) && this.http.post(this.applicationConfigService.getEndpointFor('api/register'), registration);

  }




}
