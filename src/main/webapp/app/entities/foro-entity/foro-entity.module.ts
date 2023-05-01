import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ForoEntityComponent } from './list/foro-entity.component';
import { ForoEntityDetailComponent } from './detail/foro-entity-detail.component';
import { ForoEntityUpdateComponent } from './update/foro-entity-update.component';
import { ForoEntityDeleteDialogComponent } from './delete/foro-entity-delete-dialog.component';
import { ForoEntityRoutingModule } from './route/foro-entity-routing.module';

@NgModule({
  imports: [SharedModule, ForoEntityRoutingModule],
  declarations: [ForoEntityComponent, ForoEntityDetailComponent, ForoEntityUpdateComponent, ForoEntityDeleteDialogComponent],
  exports: [ForoEntityUpdateComponent],
})
export class ForoEntityModule {}
