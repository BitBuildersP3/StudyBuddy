import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICourses } from '../courses.model';

@Component({
  selector: 'jhi-courses-detail',
  templateUrl: './courses-detail.component.html',
  styleUrls: ['./courses-detail.component.scss'],
})
export class CoursesDetailComponent implements OnInit {
  courses: ICourses | null = null;

  @ViewChild('thenBlock')
  thenBlock: any = '';

  @ViewChild('elseBlock')
  elseBlock: any = '';

  currentSection: any = {};
  staticVideo = 'https://youtu.be/3dHNOWTI7H8';

  courseResponse = {
    id: 1,
    name: 'interface functionalities microchip',
    description: 'Sopa Orígenes',
    previewImg: 'back Vasco',
    status: 'Argentine Extendido one-to-one',
    score: 2191.0,
    excerpt: 'Heredado',
    userId: 42390,
    ownerName: 'Avenida',
    userName: 'Blanco services mano',
    userVotes: 15483.0,
    users: null,
    category: null,
    sections: [
      {
        id: 1,
        name: 'Croatian driver e-services',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum pariatur quae perferendis numquam ratione recusandae ',
        excerpt: 'Ronda',
        creationDate: '2023-03-17',
        time: 59267,
        status: 'Rojo card backing',
        files: [
          {
            id: 1,
            type: 'video',
            url1: 'https://www.youtube.com/embed/3dHNOWTI7H8',
            url2: 'Account Parque Informática',
            url3: 'TCP',
            status: 'infrastructures redundant',
            name: 'reboot Genérico',
            excerpt: 'Increible',
            publishDate: '2023-03-18',
          },
          {
            id: 2,
            type: 'index',
            url1: 'Optimización Plástico',
            url2: 'streamline driver',
            url3: 'maximize',
            status: 'Checking Seguro',
            name: 'Aplicaciones Verde',
            excerpt: 'Automatizado',
            publishDate: '2023-03-18',
          },
          {
            id: 3,
            type: 'propio',
            url1: 'Optimización Plástico',
            url2: 'streamline driver',
            url3: 'maximize',
            status: 'Checking Seguro',
            name: 'Aplicaciones Verde',
            excerpt: 'Automatizado',
            publishDate: '2023-03-18',
          },
        ],
      },
      {
        id: 2,
        name: 'transmitter Vasco',
        description: 'Kiribati',
        excerpt: 'Blanco',
        creationDate: '2023-03-18',
        time: 74943,
        status: 'value-added embrace interface',
        files: [
          {
            id: 4,
            type: 'index',
            url1: 'online niches override',
            url2: 'Granito Obligatorio Guinea',
            url3: 'seize',
            status: 'back-end',
            name: 'Algodón seize',
            excerpt: 'Rand Bahamian Zapatos',
            publishDate: '2023-03-18',
          },
          {
            id: 5,
            type: 'index',
            url1: 'best-of-breed viral deposit',
            url2: 'Ordenador intranet',
            url3: 'optimizada Madera',
            status: 'Nauru FTP',
            name: 'synthesize efficient',
            excerpt: 'Andalucía',
            publishDate: '2023-03-18',
          },
        ],
      },
      {
        id: 3,
        name: 'Asociado',
        description: 'Interno',
        excerpt: 'Videojuegos Buckinghamshire',
        creationDate: '2023-03-18',
        time: 62387,
        status: '1080p 24/7',
        files: [],
      },
    ],
  };

  sections: any = this.courseResponse.sections;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courses }) => {
      this.courses = courses;
    });

    this.setCurrentSection(this.sections[0]);
  }

  setCurrentSection(section: any): void {
    this.currentSection = section;
    // eslint-disable-next-line no-console
    console.log(section);
    //
  }

  previousState(): void {
    window.history.back();
  }
}
