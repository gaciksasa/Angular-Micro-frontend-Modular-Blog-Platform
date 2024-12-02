import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';

export const routes: Routes = [
  {
    path: '',
    component: PostListComponent
  },
  {
    path: 'post/:id',
    loadComponent: () => import('./components/post-detail/post-detail.component')
      .then(m => m.PostDetailComponent)
  }
];