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
  status: string | null | undefined;
  score: number | null | undefined;
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
                score: undefined,
                redirect: data.id,
                image: data.previewImg,
                slideExerpt: data.excerpt,
                slideTitle: data.name,
                status: data.status,
              });
            });
            this.userCuourses = this.userCuourses.filter(course => course.status === 'active');
          },
        });
      });

    this.courseService.getFiveOwner().subscribe({
      next: value => {
        value.body?.map((data, index) => {
          this.ownerCourses.push({
            score: undefined,
            redirect: data.id,
            image: data.previewImg,
            slideExerpt: data.excerpt,
            slideTitle: data.name,
            status: data.status,
          });
        });
        this.ownerCourses = this.ownerCourses.filter(course => course.status === 'active');
      },
    });

    this.courseService.getTopTenCourses().subscribe({
      next: value => {
        value.body?.map((data, index) => {
          this.slides.push({
            score: data.score,
            redirect: data.id,
            image: data.previewImg,
            slideExerpt: data.excerpt,
            slideTitle: data.name,
            status: data.status,
          });
        });
        console.log(this.slides);
        this.slides = this.slides.filter(course => course.status === 'active');
      },
    });
  }
}
