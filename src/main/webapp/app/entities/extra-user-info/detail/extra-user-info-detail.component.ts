import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IExtraUserInfo } from '../extra-user-info.model';
import { UserVotesService } from '../../user-votes/service/user-votes.service';
import { ExtraUserInfoService } from '../service/extra-user-info.service';

@Component({
  selector: 'jhi-extra-user-info-detail',
  templateUrl: './extra-user-info-detail.component.html',
  styleUrls: ['./extra-user-info.css'],
})
export class ExtraUserInfoDetailComponent implements OnInit {
  extraUserInfo: any;
  userTotalVotes: number | undefined | null;
  userTotalScore: number | undefined | null;
  currentUserVote: number | undefined | null;
  constructor(
    protected activatedRoute: ActivatedRoute,
    private userVotesService: UserVotesService,
    private extraUserInfoService: ExtraUserInfoService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ extraUserInfo }) => {
      this.extraUserInfo = extraUserInfo;
    });

    this.userVotesService.getUserVotes(this.extraUserInfo?.user?.login).subscribe(response => {
      console.log(response);
      if (response.body?.length != 0) {
        // @ts-ignore
        this.currentUserVote = response.body[0]['score'];
      }
    });

    this.userVotesService.getByUser(this.extraUserInfo?.user?.login).subscribe(response => {
      // @ts-ignore
      let json = JSON.parse(response.body.json);
      this.userTotalVotes = json['num'];
      this.userTotalScore = json['avg'];
    });
  }

  scoreUser(score: number) {
    let prompt: string = `${this.extraUserInfo?.user?.login}-${score}`;
    this.userVotesService
      .addVote(prompt)
      .subscribe(response => {
        // @ts-ignore
        let json = JSON.parse(response.body.json);
        this.userTotalVotes = json['num'];
        this.userTotalScore = json['avg'];
      })
      .add(() => {
        this.extraUserInfo.score = this.userTotalScore;
        this.extraUserInfo.userVotes = this.userTotalVotes;
        this.extraUserInfoService.partialUpdate(this.extraUserInfo).subscribe();
      });
  }

  previousState(): void {
    window.history.back();
  }
}
