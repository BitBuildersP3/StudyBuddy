import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICourses } from '../courses.model';

@Component({
  selector: 'jhi-courses-detail',
  templateUrl: './courses-detail.component.html',
})
export class CoursesDetailComponent implements OnInit {
  courses: ICourses | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courses }) => {
      this.courses = courses;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
