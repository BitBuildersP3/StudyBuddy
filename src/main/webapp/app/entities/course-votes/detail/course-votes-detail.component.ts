import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICourseVotes } from '../course-votes.model';

@Component({
  selector: 'jhi-course-votes-detail',
  templateUrl: './course-votes-detail.component.html',
})
export class CourseVotesDetailComponent implements OnInit {
  courseVotes: ICourseVotes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courseVotes }) => {
      this.courseVotes = courseVotes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
