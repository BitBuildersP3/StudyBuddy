import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { FilesManagerModule } from 'app/files-manager/files-manager.module';
import {OwnRegisterFileComponent} from "../file-manager/own-register-file/own-register-file.component";
import {IndexRegisterFileComponent} from "../file-manager/index-register-file/index-register-file.component";
import {VideoRegisterFileComponent} from "../file-manager/video-register-file/video-register-file.component";
@NgModule({
  imports: [SharedModule, FilesManagerModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent],
  exports: [
    VideoRegisterFileComponent,
    IndexRegisterFileComponent,
    OwnRegisterFileComponent
  ]
})
export class HomeModule {}
