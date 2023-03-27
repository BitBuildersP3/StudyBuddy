import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'jhi-course-carousel',
  templateUrl: './course-carousel.component.html',
  styleUrls: ['./course-carousel.component.scss'],
})
export class CourseCarouselComponent implements OnInit {
  @Input()
  slides: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
