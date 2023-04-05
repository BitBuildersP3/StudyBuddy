import { Component, OnInit } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../entities/courses/service/courses.service';

interface Slides {
  image: string | null | undefined;
  slideTitle: string | null | undefined;
  slideExerpt: string | null | undefined;
  redirect: number | null | undefined;
}

interface UserCurses {
  image: string | null | undefined;
  slideTitle: string | null | undefined;
  slideExerpt: string | null | undefined;
  redirect: number | null | undefined;
}

@Component({
  selector: 'jhi-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  slides: Slides[] = [];

  userCuourses: UserCurses[] = [];

  instructors = [
    {
      image: 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1679364359/cld-sample.jpg',
      name: 'First slide label',
      about: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
    {
      image: 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1679364359/cld-sample.jpg',
      name: 'First slide label',
      about: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
    {
      image: 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1679364359/cld-sample.jpg',
      name: 'First slide label',
      about: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
    {
      image: 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1679364359/cld-sample.jpg',
      name: 'First slide label',
      about: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
  ];

  constructor(private courseService: CoursesService) {}

  ngOnInit(): void {
    this.courseService.getTopTenCourses().subscribe({
      next: value => {
        value.body?.map((data, index) => {
          this.slides.push({
            redirect: data.id,
            image: data.previewImg,
            slideExerpt: data.excerpt,
            slideTitle: data.name,
          });
        });
      },
    });
  }
}
