import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CoursesComponent } from './list/courses.component';
import { CoursesDetailComponent } from './detail/courses-detail.component';
import { CoursesUpdateComponent } from './update/courses-update.component';
import { CoursesDeleteDialogComponent } from './delete/courses-delete-dialog.component';
import { CoursesRoutingModule } from './route/courses-routing.module';

@NgModule({
  imports: [SharedModule, CoursesRoutingModule],
  declarations: [CoursesComponent, CoursesDetailComponent, CoursesUpdateComponent, CoursesDeleteDialogComponent],
})
export class CoursesModule {}
