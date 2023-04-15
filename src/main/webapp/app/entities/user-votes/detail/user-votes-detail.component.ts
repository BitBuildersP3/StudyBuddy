import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserVotes } from '../user-votes.model';

@Component({
  selector: 'jhi-user-votes-detail',
  templateUrl: './user-votes-detail.component.html',
})
export class UserVotesDetailComponent implements OnInit {
  userVotes: IUserVotes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userVotes }) => {
      this.userVotes = userVotes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
