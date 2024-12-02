import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-sm">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <span class="text-xl font-semibold text-gray-800">My Blog Platform</span>
            </div>
            <div class="flex items-center space-x-4">
              <a href="/viewer" class="text-gray-600 hover:text-gray-900">View Blog</a>
              <a href="/manager" class="text-gray-600 hover:text-gray-900">Manage Posts</a>
            </div>
          </div>
        </div>
      </nav>
      
      <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent {}