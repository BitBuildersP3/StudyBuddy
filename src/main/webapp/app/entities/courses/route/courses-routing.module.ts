import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ASC } from 'app/config/navigation.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CoursesDetailComponent } from '../detail/courses-detail.component';
import { CoursesComponent, CoursesComponentMyCourses, CoursesComponentEnrolled } from '../list';
import { CoursesUpdateComponent } from '../update/courses-update.component';
import { CoursesRoutingResolveService } from './courses-routing-resolve.service';

const coursesRoute: Routes = [
  {
    path: '',
    component: CoursesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'myCourses',
    component: CoursesComponentMyCourses,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'enrolled',
    component: CoursesComponentEnrolled,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CoursesDetailComponent,
    resolve: {
      courses: CoursesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CoursesUpdateComponent,
    resolve: {
      courses: CoursesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CoursesUpdateComponent,
    resolve: {
      courses: CoursesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(coursesRoute)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {}
