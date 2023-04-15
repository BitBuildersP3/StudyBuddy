import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserVotesComponent } from './list/user-votes.component';
import { UserVotesDetailComponent } from './detail/user-votes-detail.component';
import { UserVotesUpdateComponent } from './update/user-votes-update.component';
import { UserVotesDeleteDialogComponent } from './delete/user-votes-delete-dialog.component';
import { UserVotesRoutingModule } from './route/user-votes-routing.module';

@NgModule({
  imports: [SharedModule, UserVotesRoutingModule],
  declarations: [UserVotesComponent, UserVotesDetailComponent, UserVotesUpdateComponent, UserVotesDeleteDialogComponent],
})
export class UserVotesModule {}
