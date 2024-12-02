import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostListComponent } from './../../../blog-viewer/components/post-list/post-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PostListComponent],
  template: `
    <main class="container mx-auto p-4">
      <app-post-list />
    </main>
  `
})
export class AppComponent {}