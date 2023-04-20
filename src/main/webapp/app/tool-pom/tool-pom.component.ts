import { Component, OnInit } from '@angular/core';

interface Time {
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'jhi-tool-pom',
  templateUrl: './tool-pom.component.html',
  styleUrls: ['./tool-pom.component.scss']
})
export class ToolPomComponent implements OnInit {
  buttonPlay!: HTMLButtonElement;
  playIcon!: HTMLElement;
  buttonReset!: HTMLButtonElement;
  timeLeftDOM!: HTMLElement;
  labelSessionBreak!: HTMLElement;
  sessionLengthDOM!: HTMLElement;
  breakLengthDOM!: HTMLElement;
  sessionDecrement!: HTMLButtonElement;
  sessionIncrement!: HTMLButtonElement;
  breakDecrement!: HTMLButtonElement;
  breakIncrement!: HTMLButtonElement;

  timeLeft!: number;
  playIsClicked = true;
  isSession = false;
  breakLength = 5 * 60;
  timeLength = 25 * 60;
  interval: any;

  constructor() {}

  ngOnInit(): void {
    this.initializeDomElements();
    this.addEventListeners();
  }

  initializeDomElements(): void {
    this.buttonPlay = document.getElementById('buttonPlay') as HTMLButtonElement;
    this.playIcon = document.getElementById('playIcon') as HTMLElement;
    this.buttonReset = document.getElementById('buttonReset') as HTMLButtonElement;
    this.timeLeftDOM = document.getElementById('timeLeft') as HTMLElement;
    this.labelSessionBreak = document.getElementById('labelSessionBreak') as HTMLElement;
    this.sessionLengthDOM = document.getElementById('sessionLength') as HTMLElement;
    this.breakLengthDOM = document.getElementById('breakLength') as HTMLElement;
    this.sessionDecrement = document.getElementById('sessionDecrement') as HTMLButtonElement;
    this.sessionIncrement = document.getElementById('sessionIncrement') as HTMLButtonElement;
    this.breakDecrement = document.getElementById('breakDecrement') as HTMLButtonElement;
    this.breakIncrement = document.getElementById('breakIncrement') as HTMLButtonElement;

    const arrayTime: any = this.timeLeftDOM.innerText.split(":");
    let actualnumLeft: number = arrayTime[0];
    this.timeLeft = (actualnumLeft * 60) + parseInt(arrayTime[1]);
  }

  addEventListeners(): void {
    this.buttonPlay.addEventListener('click', () => {
      if (this.playIsClicked) {
        if (this.interval) {
          clearInterval(this.interval)
        }
        this.interval = setInterval(() => this.handleTime(), 1000);

        this.playIcon.classList.remove('fa-play');
        this.playIcon.classList.add('fa-pause');
      } else {
        this.playIcon.classList.add('fa-play');
        this.playIcon.classList.remove('fa-pause');
      }
      this.playIsClicked = !this.playIsClicked;
    });

    this.buttonReset.addEventListener('click', () => {
      this.breakLength = 5 * 60;
      this.timeLength = 25 * 60;
      this.timeLeft = this.timeLength;
      this.breakLengthDOM.innerText = "5";
      this.sessionLengthDOM.innerText = "25";
      this.timeLeftDOM.innerText = "25:00";
      if (!this.playIsClicked) {
        this.buttonPlay.click();
      }
    });

    this.sessionDecrement.addEventListener('click', () => {
      this.handleLengthButton(parseInt(this.sessionLengthDOM.innerText), this.sessionLengthDOM, false, false);
    });

    this.sessionIncrement.addEventListener('click', () => {
      this.handleLengthButton(parseInt(this.sessionLengthDOM.innerText), this.sessionLengthDOM, true, false);
    });

    this.breakDecrement.addEventListener('click', () => {
      this.breakLength = this.handleLengthButton(parseInt(this.breakLengthDOM.innerText), this.breakLengthDOM, false,true);
    });
    this.breakIncrement.addEventListener('click', () => {
      this.breakLength = this.handleLengthButton(parseInt(this.breakLengthDOM.innerText), this.breakLengthDOM, true, true);
    });
  }
    convertSeconds(seconds: number): Time {
      return {
        minutes: Math.floor(seconds / 60),
        seconds: seconds % 60
      };
    }

    handleTime(): void {
      if (this.timeLeft <= 0) {
      if (this.isSession) {
        this.labelSessionBreak.innerText = "Session";
        this.timeLeft = this.timeLength;
      } else {
        this.labelSessionBreak.innerText = "Break";
        this.timeLeft = this.breakLength;
        const beep = document.getElementById('beep') as HTMLAudioElement;
        beep.currentTime = 0;
        beep.play();
      }
      this.isSession = !this.isSession;
    } else if (this.playIsClicked) {
      clearInterval(this.interval);
    } else {
      this.timeLeft--;
      // Bronca con el $
      const minutesAndSeconds = this.convertSeconds(this.timeLeft);
       // this.timeLeftDOM.innerText = ${('0' + minutesAndSeconds.minutes).slice(-2)}:${('0' + minutesAndSeconds.seconds).slice(-2)};
        const timeLeftDOM = document.getElementById('timeLeftDOM') as HTMLElement;
        timeLeftDOM.textContent = `${('0' + minutesAndSeconds.minutes).slice(-2)}:${('0' + minutesAndSeconds.seconds).slice(-2)}`;

      }
  }

    handleLengthButton(lengthValue: number, htmlElement: HTMLElement, isAddition: boolean, isBreakLength: boolean): number {
      let result = 1;
      if (isAddition) {
        result = ++lengthValue;
        htmlElement.innerText = result.toString();
      } else {
        if (lengthValue !== 1) {
          result = --lengthValue;
          htmlElement.innerText = result.toString();
        }
      }
      if (!this.playIsClicked) {
        this.buttonPlay.click();
      }
      let resultSeconds = result * 60;
      if (!isBreakLength) {
        this.timeLength = resultSeconds;
        if (this.labelSessionBreak.innerText === 'SESSION') {
          this.timeLeftDOM.innerText = ('0' + result).slice(-2) + ":00";
          this.timeLeft = resultSeconds;
        }
      } else {
        this.breakLength = resultSeconds;

        if (this.labelSessionBreak.innerText === 'BREAK') {
          this.timeLeftDOM.innerText = ('0' + result).slice(-2) + ":00";
          this.timeLeft = resultSeconds;
        }
      }
      return resultSeconds;
    }


}
