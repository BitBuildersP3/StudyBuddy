import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICourseVotes } from '../course-votes.model';
import { CourseVotesService } from '../service/course-votes.service';

@Injectable({ providedIn: 'root' })
export class CourseVotesRoutingResolveService implements Resolve<ICourseVotes | null> {
  constructor(protected service: CourseVotesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICourseVotes | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((courseVotes: HttpResponse<ICourseVotes>) => {
          if (courseVotes.body) {
            return of(courseVotes.body);
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
