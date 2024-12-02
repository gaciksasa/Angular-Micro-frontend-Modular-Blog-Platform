import { Routes } from '@angular/router';
import { PostListManageComponent } from './components/post-list-manage/post-list-manage.component';
import { PostFormComponent } from './components/post-form/post-form.component';

export const routes: Routes = [
  { path: '', component: PostListManageComponent },
  { path: 'new', component: PostFormComponent },
  { path: 'edit/:id', component: PostFormComponent }
];