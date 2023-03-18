import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExtraUserInfoComponent } from './list/extra-user-info.component';
import { ExtraUserInfoDetailComponent } from './detail/extra-user-info-detail.component';
import { ExtraUserInfoUpdateComponent } from './update/extra-user-info-update.component';
import { ExtraUserInfoDeleteDialogComponent } from './delete/extra-user-info-delete-dialog.component';
import { ExtraUserInfoRoutingModule } from './route/extra-user-info-routing.module';

@NgModule({
  imports: [SharedModule, ExtraUserInfoRoutingModule],
  declarations: [ExtraUserInfoComponent, ExtraUserInfoDetailComponent, ExtraUserInfoUpdateComponent, ExtraUserInfoDeleteDialogComponent],
})
export class ExtraUserInfoModule {}
