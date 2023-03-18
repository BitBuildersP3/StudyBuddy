import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PomodoroComponent } from './list/pomodoro.component';
import { PomodoroDetailComponent } from './detail/pomodoro-detail.component';
import { PomodoroUpdateComponent } from './update/pomodoro-update.component';
import { PomodoroDeleteDialogComponent } from './delete/pomodoro-delete-dialog.component';
import { PomodoroRoutingModule } from './route/pomodoro-routing.module';

@NgModule({
  imports: [SharedModule, PomodoroRoutingModule],
  declarations: [PomodoroComponent, PomodoroDetailComponent, PomodoroUpdateComponent, PomodoroDeleteDialogComponent],
})
export class PomodoroModule {}
