import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserVotes } from '../user-votes.model';
import { UserVotesService } from '../service/user-votes.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-votes-delete-dialog.component.html',
})
export class UserVotesDeleteDialogComponent {
  userVotes?: IUserVotes;

  constructor(protected userVotesService: UserVotesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userVotesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
