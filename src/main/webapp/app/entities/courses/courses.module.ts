import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CoursesComponent } from './list/courses.component';
import { CoursesComponentMyCourses } from './list/courses.component.MyCourses';

import { CoursesDetailComponent } from './detail/courses-detail.component';
import { CoursesUpdateComponent } from './update/courses-update.component';
import { CoursesDeleteDialogComponent } from './delete/courses-delete-dialog.component';
import { CoursesRoutingModule } from './route/courses-routing.module';
import { CoursesComponentEnrolled } from './list';
import { SectionModule } from 'app/entities/section/section.module';
import { UrlChangeDirective } from './detail/url-change.directive';
import { FilesManagerModule } from '../../files-manager/files-manager.module';

@NgModule({
  declarations: [
    CoursesComponent,
    CoursesComponentMyCourses,
    CoursesComponentEnrolled,
    CoursesDetailComponent,
    CoursesUpdateComponent,
    CoursesDeleteDialogComponent,
    UrlChangeDirective,
  ],
  imports: [SharedModule, CoursesRoutingModule, SectionModule, FilesManagerModule],
})
export class CoursesModule {}
