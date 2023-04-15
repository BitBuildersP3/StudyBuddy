import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICourseVotes } from '../course-votes.model';
import { CourseVotesService } from '../service/course-votes.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './course-votes-delete-dialog.component.html',
})
export class CourseVotesDeleteDialogComponent {
  courseVotes?: ICourseVotes;

  constructor(protected courseVotesService: CourseVotesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.courseVotesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
