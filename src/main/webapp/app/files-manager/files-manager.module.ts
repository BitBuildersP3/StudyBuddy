import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilesManagerComponent } from './files-manager.component';

import { IndexRegisterFileComponent } from 'app/file-manager/index-register-file/index-register-file.component';
import { OwnRegisterFileComponent } from '../file-manager/own-register-file/own-register-file.component';
import { VideoRegisterFileComponent } from '../file-manager/video-register-file/video-register-file.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [FilesManagerComponent, IndexRegisterFileComponent, VideoRegisterFileComponent, OwnRegisterFileComponent],
  imports: [CommonModule, FormsModule, SharedModule],
  exports: [FilesManagerComponent],
})
export class FilesManagerModule {}
