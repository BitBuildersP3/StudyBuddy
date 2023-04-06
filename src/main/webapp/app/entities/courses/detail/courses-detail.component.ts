import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICourses } from '../courses.model';
import { CoursesService } from '../service/courses.service';
import { FilesService } from '../../files/service/files.service';
import { ITEM_DELETED_EVENT } from '../../../config/navigation.constants';

@Component({
  selector: 'jhi-courses-detail',
  templateUrl: './courses-detail.component.html',
  styleUrls: ['./courses-detail.component.scss'],
})
export class CoursesDetailComponent implements OnInit {
  courses: any;
  @ViewChild('thenBlock')
  thenBlock: any = '';

  @ViewChild('elseBlock')
  elseBlock: any = '';

  linkTitle = 'Abrir';

  currentSection: any = {};

  courseResponse: any = {};
  sections: any = ['init'];
  filesLength = 0;
  isActive: any = 0;

  constructor(protected activatedRoute: ActivatedRoute, private courseService: CoursesService, protected filesService: FilesService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courses }) => {
      this.courses = courses;
    });
    this.courseService.getCouseDataById(this.courses?.id).subscribe(data => {
      this.courseResponse = data.body;
      this.sections = this.courseResponse.sections;
      this.setCurrentSection(this.sections[0]);
    });
  }

  setActive(index: any): void {
    this.isActive = index;
  }

  setCurrentSection(section: any): void {
    this.currentSection = section;
    this.filesLength = this.currentSection.files.length;

    //
  }

  previousState(): void {
    window.history.back();
  }

  delete(id: number): void {
    this.filesService.delete(id).subscribe(() => {
      console.log('delete' + id.toString());
      window.location.href = '/courses/myCourses';
    });
  }
}
