import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IForoEntity } from '../foro-entity.model';
import { ForoEntityService } from '../service/foro-entity.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './foro-entity-delete-dialog.component.html',
})
export class ForoEntityDeleteDialogComponent {
  foroEntity?: IForoEntity;

  constructor(protected foroEntityService: ForoEntityService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.foroEntityService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
