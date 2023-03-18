import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICourses } from '../courses.model';
import { CoursesService } from '../service/courses.service';

@Injectable({ providedIn: 'root' })
export class CoursesRoutingResolveService implements Resolve<ICourses | null> {
  constructor(protected service: CoursesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICourses | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((courses: HttpResponse<ICourses>) => {
          if (courses.body) {
            return of(courses.body);
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
