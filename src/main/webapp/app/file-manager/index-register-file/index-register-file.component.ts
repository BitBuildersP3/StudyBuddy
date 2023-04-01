import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'jhi-index-register-file',
  templateUrl: './index-register-file.component.html',
  styleUrls: ['./index-register-file.component.scss']
})
export class IndexRegisterFileComponent implements OnInit {

  courses: string[] = ["Curso 1", "Curso 2", "Curso 3"]; // arreglo de opciones para curso
  classes: string[] = ["Clase 1", "Clase 2", "Clase 3"]; // arreglo de opciones para clase

  isFormValid = false;

  indexFileRegisterForm = new FormGroup({ fileName: new FormControl(), fileDescription: new FormControl(), url1: new FormControl("",[Validators.required]), url2: new FormControl(), url3: new FormControl(), course: new FormControl(), classs: new FormControl() });

  @ViewChild('file-name', { static: false }) fileName?: HTMLInputElement;
  @ViewChild('file-description', { static: false }) fileDescription?: HTMLInputElement;

  @ViewChild('url1', { static: false }) url1?: HTMLInputElement;
  @ViewChild('url2', { static: false }) url2?: HTMLInputElement;
  @ViewChild('url3', { static: false }) url3?: HTMLInputElement;

  @ViewChild('course', { static: false }) course?: HTMLSelectElement;
  @ViewChild('class', { static: false }) classs?: HTMLSelectElement;

  constructor() { }

  ngOnInit(): void {

    const courseSelect = document.getElementById('course') as HTMLSelectElement;
    const classSelect = document.getElementById('class') as HTMLSelectElement;

    for (let i = 0; i < this.courses.length; i++) {
      const option = document.createElement('option');
      option.text = this.courses[i];
      option.value = this.courses[i];
      courseSelect.add(option);
    }

    for (let i = 0; i < this.classes.length; i++) {
      const option = document.createElement('option');
      option.text = this.classes[i];
      option.value = this.classes[i];
      classSelect.add(option);
    }


  }


  onInputChange(): void {

    const fileName = this.fileName?.value ?? '';
    const fileDescription = this.fileDescription?.value ?? '';
    const url1 = this.url1?.value ?? '';
    const course = this.course?.value ?? '';
    const classs = this.classs?.value ?? '';

    this.isFormValid = fileName !== '' && fileDescription !== '' && url1 !== '' && course !== '' && classs !== '';
  }

  onSubmit(): void {
    if (this.isFormValid) {
      console.log('Formulario válido');
    }
  }

}
