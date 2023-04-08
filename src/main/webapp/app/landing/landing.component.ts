import { Component, OnInit } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { CoursesService } from '../entities/courses/service/courses.service';
import { ExtraUserInfoService } from '../entities/extra-user-info/service/extra-user-info.service';
import { switchMap } from 'rxjs';
import { Title } from '@angular/platform-browser';

interface CoursesData {
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
  slides: CoursesData[] = [];
  userCuourses: CoursesData[] = [];
  ownerCourses: CoursesData[] = [];
  private currentUserId: number | undefined = 0;

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

  constructor(private courseService: CoursesService, private extraUserInfo: ExtraUserInfoService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Página de Inicio');

    //trae el id del usuario
    this.extraUserInfo
      .getInfoByCurrentUser()
      .subscribe({
        next: value => {
          this.currentUserId = value.body?.user?.id;
        },
      })
      .add(() => {
        //trae los primeros 5 cursos del usuario despues de traer el id del usuario
        this.courseService.getFiveCourseById(this.currentUserId).subscribe({
          next: value => {
            value.body?.map((data, index) => {
              this.userCuourses.push({
                redirect: data.id,
                image: data.previewImg,
                slideExerpt: data.excerpt,
                slideTitle: data.name,
              });
            });
          },
        });
      });

    this.courseService.getFiveOwner().subscribe({
      next: value => {
        value.body?.map((data, index) => {
          this.ownerCourses.push({
            redirect: data.id,
            image: data.previewImg,
            slideExerpt: data.excerpt,
            slideTitle: data.name,
          });
        });
      },
    });

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
