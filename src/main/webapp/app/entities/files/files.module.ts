import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FilesComponent } from './list/files.component';
import { FilesDetailComponent } from './detail/files-detail.component';
import { FilesUpdateComponent } from './update/files-update.component';
import { FilesDeleteDialogComponent } from './delete/files-delete-dialog.component';
import { FilesRoutingModule } from './route/files-routing.module';
import {FilesManagerModule} from "../../files-manager/files-manager.module";

@NgModule({
  imports: [SharedModule, FilesRoutingModule],
  declarations: [FilesComponent, FilesDetailComponent, FilesUpdateComponent, FilesDeleteDialogComponent],
  // Siempre hay que Importar y exportar
  exports: [FilesManagerModule],
})
export class FilesModule {}
