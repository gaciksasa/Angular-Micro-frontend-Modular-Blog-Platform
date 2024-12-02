import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Blog Posts</h1>
      <router-outlet />
    </main>
  `
})
export class AppComponent {}