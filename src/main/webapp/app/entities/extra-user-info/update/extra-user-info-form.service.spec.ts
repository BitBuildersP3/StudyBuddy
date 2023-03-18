import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../extra-user-info.test-samples';

import { ExtraUserInfoFormService } from './extra-user-info-form.service';

describe('ExtraUserInfo Form Service', () => {
  let service: ExtraUserInfoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtraUserInfoFormService);
  });

  describe('Service methods', () => {
    describe('createExtraUserInfoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createExtraUserInfoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            phone: expect.any(Object),
            degree: expect.any(Object),
            profilePicture: expect.any(Object),
            birthDay: expect.any(Object),
            score: expect.any(Object),
            userVotes: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IExtraUserInfo should create a new form with FormGroup', () => {
        const formGroup = service.createExtraUserInfoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            phone: expect.any(Object),
            degree: expect.any(Object),
            profilePicture: expect.any(Object),
            birthDay: expect.any(Object),
            score: expect.any(Object),
            userVotes: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getExtraUserInfo', () => {
      it('should return NewExtraUserInfo for default ExtraUserInfo initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createExtraUserInfoFormGroup(sampleWithNewData);

        const extraUserInfo = service.getExtraUserInfo(formGroup) as any;

        expect(extraUserInfo).toMatchObject(sampleWithNewData);
      });

      it('should return NewExtraUserInfo for empty ExtraUserInfo initial value', () => {
        const formGroup = service.createExtraUserInfoFormGroup();

        const extraUserInfo = service.getExtraUserInfo(formGroup) as any;

        expect(extraUserInfo).toMatchObject({});
      });

      it('should return IExtraUserInfo', () => {
        const formGroup = service.createExtraUserInfoFormGroup(sampleWithRequiredData);

        const extraUserInfo = service.getExtraUserInfo(formGroup) as any;

        expect(extraUserInfo).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IExtraUserInfo should not enable id FormControl', () => {
        const formGroup = service.createExtraUserInfoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewExtraUserInfo should disable id FormControl', () => {
        const formGroup = service.createExtraUserInfoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
