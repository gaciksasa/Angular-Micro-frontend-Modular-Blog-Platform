import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'viewer',
    loadChildren: () => import('../../../../projects/blog-viewer/src/app/app.routes').then(m => m.routes)
  },
  {
    path: 'manager',
    loadChildren: () => import('../../../../projects/blog-manager/src/app/app.routes').then(m => m.routes)
  },
  {
    path: '',
    redirectTo: 'viewer',
    pathMatch: 'full'
  }
];