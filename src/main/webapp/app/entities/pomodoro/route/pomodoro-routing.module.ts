import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PomodoroComponent } from '../list/pomodoro.component';
import { PomodoroDetailComponent } from '../detail/pomodoro-detail.component';
import { PomodoroUpdateComponent } from '../update/pomodoro-update.component';
import { PomodoroRoutingResolveService } from './pomodoro-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const pomodoroRoute: Routes = [
  {
    path: '',
    component: PomodoroComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PomodoroDetailComponent,
    resolve: {
      pomodoro: PomodoroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PomodoroUpdateComponent,
    resolve: {
      pomodoro: PomodoroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PomodoroUpdateComponent,
    resolve: {
      pomodoro: PomodoroRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pomodoroRoute)],
  exports: [RouterModule],
})
export class PomodoroRoutingModule {}
