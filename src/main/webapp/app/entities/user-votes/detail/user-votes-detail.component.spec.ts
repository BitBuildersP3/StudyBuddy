import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserVotesDetailComponent } from './user-votes-detail.component';

describe('UserVotes Management Detail Component', () => {
  let comp: UserVotesDetailComponent;
  let fixture: ComponentFixture<UserVotesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserVotesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userVotes: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserVotesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserVotesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userVotes on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userVotes).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
