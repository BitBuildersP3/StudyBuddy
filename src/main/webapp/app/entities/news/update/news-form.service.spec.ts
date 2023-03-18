import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../news.test-samples';

import { NewsFormService } from './news-form.service';

describe('News Form Service', () => {
  let service: NewsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsFormService);
  });

  describe('Service methods', () => {
    describe('createNewsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createNewsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            excerpt: expect.any(Object),
            body: expect.any(Object),
            image: expect.any(Object),
            creationDate: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing INews should create a new form with FormGroup', () => {
        const formGroup = service.createNewsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            excerpt: expect.any(Object),
            body: expect.any(Object),
            image: expect.any(Object),
            creationDate: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getNews', () => {
      it('should return NewNews for default News initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createNewsFormGroup(sampleWithNewData);

        const news = service.getNews(formGroup) as any;

        expect(news).toMatchObject(sampleWithNewData);
      });

      it('should return NewNews for empty News initial value', () => {
        const formGroup = service.createNewsFormGroup();

        const news = service.getNews(formGroup) as any;

        expect(news).toMatchObject({});
      });

      it('should return INews', () => {
        const formGroup = service.createNewsFormGroup(sampleWithRequiredData);

        const news = service.getNews(formGroup) as any;

        expect(news).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing INews should not enable id FormControl', () => {
        const formGroup = service.createNewsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewNews should disable id FormControl', () => {
        const formGroup = service.createNewsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
