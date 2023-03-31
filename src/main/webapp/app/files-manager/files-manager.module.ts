import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesManagerComponent } from './files-manager.component';
import { PanelTypeFileComponent } from 'app/file-manager/panel-type-file/panel-type-file.component';
import { IndexRegisterFileComponent } from 'app/file-manager/index-register-file/index-register-file.component';

@NgModule({
  declarations: [FilesManagerComponent, PanelTypeFileComponent, IndexRegisterFileComponent],
  imports: [CommonModule],
  exports: [FilesManagerComponent],
})
export class FilesManagerModule {}
