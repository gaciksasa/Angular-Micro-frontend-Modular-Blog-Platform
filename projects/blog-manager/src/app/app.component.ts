import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="container mx-auto p-4 max-w-4xl">
      <router-outlet />
    </main>
  `
})
export class AppComponent {}