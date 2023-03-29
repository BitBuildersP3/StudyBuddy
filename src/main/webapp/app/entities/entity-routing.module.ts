import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'extra-user-info',
        data: { pageTitle: 'studyBuddyApp.extraUserInfo.home.title' },
        loadChildren: () => import('./extra-user-info/extra-user-info.module').then(m => m.ExtraUserInfoModule),
      },
      {
        path: 'news',
        data: { pageTitle: 'studyBuddyApp.news.home.title' },
        loadChildren: () => import('./news/news.module').then(m => m.NewsModule),
      },
      {
        path: 'events',
        data: { pageTitle: 'studyBuddyApp.events.home.title' },
        loadChildren: () => import('./events/events.module').then(m => m.EventsModule),
      },
      {
        path: 'todo-list',
        data: { pageTitle: 'studyBuddyApp.todoList.home.title' },
        loadChildren: () => import('./todo-list/todo-list.module').then(m => m.TodoListModule),
      },
      {
        path: 'pomodoro',
        data: { pageTitle: 'studyBuddyApp.pomodoro.home.title' },
        loadChildren: () => import('./pomodoro/pomodoro.module').then(m => m.PomodoroModule),
      },
      {
        path: 'courses',
        data: { pageTitle: 'studyBuddyApp.courses.home.title' },
        loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule),
      },
      {
        path: 'section',
        data: { pageTitle: 'studyBuddyApp.section.home.title' },
        loadChildren: () => import('./section/section.module').then(m => m.SectionModule),
      },
      {
        path: 'files',
        data: { pageTitle: 'studyBuddyApp.files.home.title' },
        loadChildren: () => import('./files/files.module').then(m => m.FilesModule),
      },
      {
        path: 'category',
        data: { pageTitle: 'studyBuddyApp.category.home.title' },
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
      },
      {
        path: 'myCourses',
        data: { pageTitle: 'studyBuddyApp.category.home.title' },
        loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
