import { Component, OnInit } from '@angular/core';

interface Time {
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'jhi-tool-pom',
  templateUrl: './tool-pom.component.html',
  styleUrls: ['./tool-pom.component.scss'],
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

    const arrayTime: any = this.timeLeftDOM.innerText.split(':');
    console.log('Arreglo entero' + arrayTime);
    let actualnumLeft: number = arrayTime[0];
    let actualnumLeft2: number = arrayTime[1];
    console.log('array en 0: ' + actualnumLeft);
    console.log('array en 1: ' + actualnumLeft2);
    console.log('tiempo de array 0 ' + arrayTime[0]);
    console.log('tiempo de array 1 ' + arrayTime[1]);
    // this.timeLeft = (actualnumLeft * 60) ;
    this.timeLeft = 5;
    console.log('En donde se hizo el parseo' + this.timeLeft);
  }

  addEventListeners(): void {
    this.buttonPlay.addEventListener('click', () => {
      if (this.playIsClicked) {
        if (this.interval) {
          clearInterval(this.interval);
        }
        this.interval = setInterval(() => this.handleTime(), 1000);

        this.playIcon.classList.remove('circle-play');
        this.playIcon.classList.add('circle-stop');
      } else {
        this.playIcon.classList.add('circle-play');
        this.playIcon.classList.remove('circle-stop');
      }
      this.playIsClicked = !this.playIsClicked;
    });

    this.buttonReset.addEventListener('click', () => {
      this.breakLength = 5 * 60;
      this.timeLength = 25 * 60;
      this.timeLeft = this.timeLength;
      this.breakLengthDOM.innerText = '5';
      this.sessionLengthDOM.innerText = '25';
      this.timeLeftDOM.innerText = '25:00';
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
      this.breakLength = this.handleLengthButton(parseInt(this.breakLengthDOM.innerText), this.breakLengthDOM, false, true);
    });
    this.breakIncrement.addEventListener('click', () => {
      this.breakLength = this.handleLengthButton(parseInt(this.breakLengthDOM.innerText), this.breakLengthDOM, true, true);
    });
  }
  convertSeconds(seconds: number): Time {
    return {
      minutes: Math.floor(seconds / 60),
      seconds: seconds % 60,
    };
  }

  formatSecondsToMinutes(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  handleTime(): void {
    //console.log("TimeLeft =" + this.timeLeft);
    if (this.timeLeft <= 0) {
      if (this.isSession) {
        this.labelSessionBreak.innerText = 'TRABAJO';
        this.timeLeft = this.timeLength;
      } else {
        this.labelSessionBreak.innerText = 'DESCANSO';
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

      const minutesAndSeconds = this.convertSeconds(this.timeLeft);

      const timeLeftDOM = document.getElementById('timeLeft') as HTMLElement;

      //console.log("timeLeftDOM" + timeLeftDOM);

      timeLeftDOM.innerText = this.formatSecondsToMinutes(this.timeLeft);
      console.log(timeLeftDOM);
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

      if (this.labelSessionBreak.innerText === 'TRABAJO') {
        this.timeLeftDOM.innerText = ('0' + result).slice(-2) + ':00';
        this.timeLeft = resultSeconds;
      }
    } else {
      this.breakLength = resultSeconds;

      if (this.labelSessionBreak.innerText === 'DESCANSO') {
        this.timeLeftDOM.innerText = ('0' + result).slice(-2) + ':00';
        this.timeLeft = resultSeconds;
      }
    }
    return resultSeconds;
  }
}
