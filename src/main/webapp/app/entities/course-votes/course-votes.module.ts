import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CourseVotesComponent } from './list/course-votes.component';
import { CourseVotesDetailComponent } from './detail/course-votes-detail.component';
import { CourseVotesUpdateComponent } from './update/course-votes-update.component';
import { CourseVotesDeleteDialogComponent } from './delete/course-votes-delete-dialog.component';
import { CourseVotesRoutingModule } from './route/course-votes-routing.module';

@NgModule({
  imports: [SharedModule, CourseVotesRoutingModule],
  declarations: [CourseVotesComponent, CourseVotesDetailComponent, CourseVotesUpdateComponent, CourseVotesDeleteDialogComponent],
})
export class CourseVotesModule {}
