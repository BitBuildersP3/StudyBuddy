import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFiles } from '../files.model';
import { FilesService } from '../service/files.service';

@Injectable({ providedIn: 'root' })
export class FilesRoutingResolveService implements Resolve<IFiles | null> {
  constructor(protected service: FilesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFiles | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((files: HttpResponse<IFiles>) => {
          if (files.body) {
            return of(files.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
