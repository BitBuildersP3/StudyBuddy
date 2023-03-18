import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExtraUserInfo } from '../extra-user-info.model';
import { ExtraUserInfoService } from '../service/extra-user-info.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './extra-user-info-delete-dialog.component.html',
})
export class ExtraUserInfoDeleteDialogComponent {
  extraUserInfo?: IExtraUserInfo;

  constructor(protected extraUserInfoService: ExtraUserInfoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.extraUserInfoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
