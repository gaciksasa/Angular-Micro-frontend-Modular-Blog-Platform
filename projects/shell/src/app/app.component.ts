import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BlogService } from 'shared-lib';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [BlogService],
  template: `
    <main class="container mx-auto p-4">
      <router-outlet />
    </main>
  `
})
export class AppComponent {}