import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SectionFormService, SectionFormGroup } from './section-form.service';
import { ISection } from '../section.model';
import { SectionService } from '../service/section.service';
import { ICourses } from 'app/entities/courses/courses.model';
import { CoursesService } from 'app/entities/courses/service/courses.service';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-section-update',
  templateUrl: './section-update.component.html',
})
export class SectionUpdateComponent implements OnInit {
  @Input() title = '';
  @Input() course: any = '';
  @Input() idSection = 0;
  @Output() customEvent = new EventEmitter();
  @Output() closeEvent = new EventEmitter();

  isSaving = false;
  section: any | null = null;

  coursesSharedCollection: ICourses[] = [];

  editForm: SectionFormGroup = this.sectionFormService.createSectionFormGroup();

  constructor(
    protected sectionService: SectionService,
    protected sectionFormService: SectionFormService,
    protected coursesService: CoursesService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCourses = (o1: ICourses | null, o2: ICourses | null): boolean => this.coursesService.compareCourses(o1, o2);

  triggerCustomEvent(): void {
    this.customEvent.emit();
  }

  ngOnInit(): void {
    if (this.idSection !== undefined && this.idSection !== 0) {
      this.sectionService.find(this.idSection).subscribe((data: any) => {
        this.section = data.body;

        if (data) {
          this.updateForm(data.body);
        }

        this.loadRelationshipsOptions();
      });
    }
  }

  previousState(): void {
    window.history.back();
  }

  onClose(): void {
    this.customEvent.emit();
  }
  showSwall(): void {
    Swal.fire({
      icon: 'success',
      title: 'Datos guardados correctamente',
      showConfirmButton: true,
      timer: 2000,
    }).then(result => {
      location.reload();
    });
  }

  save(): void {
    this.isSaving = true;
    const section = this.sectionFormService.getSection(this.editForm);
    const newObjSection = {
      creationDate: dayjs(),
      description: section.description,
      excerpt: section.excerpt,
      name: section.name,
      id: section.id,
      status: 'active',
      time: 0,
      courses: this.course,
    };
    if (section.id !== null) {
      if ((newObjSection.name !== null, newObjSection.description !== null, newObjSection.excerpt !== null)) {
        this.subscribeToSaveResponse(this.sectionService.update(newObjSection));
      }
    } else {
      if ((newObjSection.name !== null, newObjSection.description !== null, newObjSection.excerpt !== null)) {
        this.subscribeToSaveResponse(this.sectionService.create(newObjSection));
      }
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISection>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.editForm.reset();
    this.customEvent.emit();
    this.showSwall();
  }

  protected onSaveError(): void {}

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(section: ISection): void {
    this.section = section;
    this.sectionFormService.resetForm(this.editForm, section);
    this.coursesSharedCollection = this.coursesService.addCoursesToCollectionIfMissing<ICourses>(
      this.coursesSharedCollection,
      section.courses
    );
  }

  protected loadRelationshipsOptions(): void {
    this.coursesService
      .query()
      .pipe(map((res: HttpResponse<ICourses[]>) => res.body ?? []))
      .pipe(map((courses: ICourses[]) => this.coursesService.addCoursesToCollectionIfMissing<ICourses>(courses, this.section?.courses)))
      .subscribe((courses: ICourses[]) => (this.coursesSharedCollection = courses));
  }
}
