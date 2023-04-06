import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-own-register-file',
  templateUrl: './own-register-file.component.html',
  styleUrls: ['./own-register-file.component.scss']
})
export class OwnRegisterFileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  comidaChina( url : string) {
    console.log("comida china: " + url);

  }

}
