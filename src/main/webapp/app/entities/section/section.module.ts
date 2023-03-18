import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SectionComponent } from './list/section.component';
import { SectionDetailComponent } from './detail/section-detail.component';
import { SectionUpdateComponent } from './update/section-update.component';
import { SectionDeleteDialogComponent } from './delete/section-delete-dialog.component';
import { SectionRoutingModule } from './route/section-routing.module';

@NgModule({
  imports: [SharedModule, SectionRoutingModule],
  declarations: [SectionComponent, SectionDetailComponent, SectionUpdateComponent, SectionDeleteDialogComponent],
})
export class SectionModule {}
