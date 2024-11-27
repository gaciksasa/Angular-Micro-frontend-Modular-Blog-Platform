import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PostListComponent],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Blog Manager</h1>
      <router-outlet />
    </div>
  `
})
export class AppComponent {}