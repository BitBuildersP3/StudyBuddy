import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPomodoro } from '../pomodoro.model';
import { PomodoroService } from '../service/pomodoro.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './pomodoro-delete-dialog.component.html',
})
export class PomodoroDeleteDialogComponent {
  pomodoro?: IPomodoro;

  constructor(protected pomodoroService: PomodoroService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.pomodoroService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
