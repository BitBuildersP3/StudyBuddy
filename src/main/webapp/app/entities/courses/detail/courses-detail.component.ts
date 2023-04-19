import { ChangeDetectorRef, AfterContentChecked, Component, Directive, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICourses } from '../courses.model';
import { CoursesService } from '../service/courses.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SectionService } from 'app/entities/section/service/section.service';
import { FilesService } from '../../files/service/files.service';
import { ITEM_DELETED_EVENT } from '../../../config/navigation.constants';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { ExtraUserInfoService } from 'app/entities/extra-user-info/service/extra-user-info.service';
import { CourseVotesService } from '../../course-votes/service/course-votes.service';

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
  isOwner = true;
  isRegister = true;

  ownerImg: string | undefined | null;
  ownerPublicId: number | undefined | null;
  ownerPublicName: string | undefined | null;

  TotalVotes: number | undefined | null;
  totalUsers: number | undefined | null;

  currentUserVote: number | undefined | null;

  constructor(
    protected activatedRoute: ActivatedRoute,
    private courseService: CoursesService,
    private _sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private sectionService: SectionService,
    protected filesService: FilesService,
    private titleService: Title,
    private extraInfoService: ExtraUserInfoService,
    private courseVotesService: CourseVotesService
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
    Swal.fire({
      title: '¿Está seguro que desea borrar la clase?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
    }).then(result => {
      if (result.isConfirmed) {
        const delSecton = {
          id: section.id,
          status: 'deleted',
        };
        this.sectionService.partialUpdate(delSecton).subscribe(() => {
          this.fetchCourseData(this.courses?.id);
        });
        Swal.fire({
          icon: 'success',
          title: 'Eliminado correctamente',
          showConfirmButton: true,
        });
      }
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
    this.titleService.setTitle('Detalle del Curso');
    this.fetchData();
    this.courses?.id;
    this.extraInfoService.getInfoByCurrentUser().subscribe(response => {
      const currUsrData = response.body?.user?.id;
      // console.log(currData);
      this.getIsRegister(this.courses?.id, currUsrData);
    });

    this.courseService.getIsOwner(this.courses?.id).subscribe(response => {
      this.isOwner = response.body;
    });

    this.courseVotesService.getUserVotes(this.courses?.id).subscribe(response => {
      console.log(response.body);
      if (response.body?.length !== 0) {
        // @ts-ignore
        this.currentUserVote = response.body[0]['score'];
      }
    });

    this.courseVotesService.getByCourse(this.courses.id).subscribe(response => {
      // @ts-ignore
      let json = JSON.parse(response.body.json);
      this.totalUsers = json['num'];
      this.TotalVotes = json['avg'];
    });

    this.extraInfoService.getInfoByGivenUser(this.courses.ownerName).subscribe(response => {
      console.log(response);
      this.ownerImg = response.body?.profilePicture;
      this.ownerPublicId = response.body?.id;
      this.ownerPublicName = this.courses.ownerName;
    });
  }

  scoreCourse(score: number) {
    let prompt: string = `${this.courses.id}-${score}`;
    this.courseVotesService
      .addVote(prompt)
      .subscribe(response => {
        // @ts-ignore
        let json = JSON.parse(response.body.json);
        this.totalUsers = json['num'];
        this.TotalVotes = json['avg'];
      })
      .add(() => {
        this.courses.score = this.TotalVotes;
        this.courses.userVotes = this.totalUsers;
        this.courseService.partialUpdate(this.courses).subscribe();
      });
  }

  // this method get the value of the current user and the id of the current course
  getIsRegister(idCourse: any, idUser: any): void {
    const customId = `${idCourse}-${idUser}`;
    this.courseService.getIsRegister(customId).subscribe(response => {
      this.isRegister = response.body;
    });
  }
  sanitizeUrl(url: string): void {
    const dirtyUrl = 'https://www.youtube.com/embed/' + url;
    this.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(dirtyUrl);
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
  // SweetAlert con reload
  delete(id: number): void {
    Swal.fire({
      title: '¿Está seguro que desea eliminar el archivo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí!',
    }).then(result => {
      if (result.isConfirmed) {
        this.filesService.delete(id).subscribe(() => {
          // console.log('delete' + id.toString());
        });
        Swal.fire({
          icon: 'success',
          title: 'Eliminado correctamente',
          showConfirmButton: true,
        }).then(result => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      }
    });
  }
}
