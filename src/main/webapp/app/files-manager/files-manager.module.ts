import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilesManagerComponent } from './files-manager.component';
import { PanelTypeFileComponent } from 'app/file-manager/panel-type-file/panel-type-file.component';




import {IndexRegisterFileModule} from "../file-manager/index-register-file/index-register-file.module";
import { VideoRegisterFileModule } from 'app/file-manager/video-register-file/video-register-file.module';
import { OwnRegisterFileModule } from 'app/file-manager/own-register-file/own-register-file.module';

import {VideoRegisterFileComponent} from "../file-manager/video-register-file/video-register-file.component";
import {IndexRegisterFileComponent} from "../file-manager/index-register-file/index-register-file.component";
import {OwnRegisterFileComponent} from "../file-manager/own-register-file/own-register-file.component";

@NgModule({
  declarations: [FilesManagerComponent, PanelTypeFileComponent, VideoRegisterFileComponent, IndexRegisterFileComponent, OwnRegisterFileComponent],
  imports: [CommonModule,
    VideoRegisterFileModule,
    IndexRegisterFileModule,
    OwnRegisterFileModule],
  exports: [FilesManagerComponent, VideoRegisterFileComponent,
    IndexRegisterFileComponent,
    OwnRegisterFileComponent],
})
export class FilesManagerModule {}
