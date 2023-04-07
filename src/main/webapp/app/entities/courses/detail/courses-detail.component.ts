import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICourses } from '../courses.model';
import { CoursesService } from '../service/courses.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SectionService } from 'app/entities/section/service/section.service';

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
  safeUrl: any = '';
  url: any;
  isOpen = false;
  counter = 0;
  constructor(
    protected activatedRoute: ActivatedRoute,
    private courseService: CoursesService,
    private _sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private sectionService: SectionService
  ) {}

  setIsOpen(): void {
    this.isOpen = !this.isOpen;
  }
  fetchData(): void {
    this.activatedRoute.data.subscribe(({ courses }) => {
      this.courses = courses;
      this.fetchCourseData(this.courses?.id);
    });
  }

  remove(section: any): void {
    const delSecton = {
      id: section.id,
      status: 'deleted',
    };
    this.sectionService.partialUpdate(delSecton).subscribe(() => {
      this.fetchCourseData(this.courses?.id);
    });
  }

  increaseCounter(): void {
    this.counter = this.counter + 1;
  }

  fetchCourseData(courseId: any): void {
    this.courseService.getCouseDataById(courseId).subscribe(data => {
      this.courseResponse = data.body;
      this.sections = this.courseResponse.sections;
      this.sections = this.sections.filter((obj: any) => obj.status === 'active');
      this.sections.sort((a: any, b: any) => a.id - b.id);

      this.setCurrentSection(this.sections[0]);
    });
  }

  onSaveSection(data: any): void {
    this.fetchCourseData(data);
    // todo: refactor the code, this function is not suposed to be executed
    // this.fetchData();
    // this.cdRef.markForCheck();
  }
  ngOnInit(): void {
    this.fetchData();
  }

  sanitizeUrl(url: string): void {
    this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  setActive(index: any): void {
    this.isActive = index;
  }

  setCurrentSection(section: any): void {
    this.currentSection = section;
    this.filesLength = this.currentSection.files.length;
  }

  previousState(): void {
    window.history.back();
  }
}
