import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CourseVotesComponent } from '../list/course-votes.component';
import { CourseVotesDetailComponent } from '../detail/course-votes-detail.component';
import { CourseVotesUpdateComponent } from '../update/course-votes-update.component';
import { CourseVotesRoutingResolveService } from './course-votes-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const courseVotesRoute: Routes = [
  {
    path: '',
    component: CourseVotesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CourseVotesDetailComponent,
    resolve: {
      courseVotes: CourseVotesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CourseVotesUpdateComponent,
    resolve: {
      courseVotes: CourseVotesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CourseVotesUpdateComponent,
    resolve: {
      courseVotes: CourseVotesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(courseVotesRoute)],
  exports: [RouterModule],
})
export class CourseVotesRoutingModule {}
