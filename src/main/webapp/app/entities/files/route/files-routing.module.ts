import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FilesComponent } from '../list/files.component';
import { FilesDetailComponent } from '../detail/files-detail.component';
import { FilesUpdateComponent } from '../update/files-update.component';
import { FilesRoutingResolveService } from './files-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const filesRoute: Routes = [
  {
    path: '',
    component: FilesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FilesDetailComponent,
    resolve: {
      files: FilesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FilesUpdateComponent,
    resolve: {
      files: FilesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FilesUpdateComponent,
    resolve: {
      files: FilesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(filesRoute)],
  exports: [RouterModule],
})
export class FilesRoutingModule {}
