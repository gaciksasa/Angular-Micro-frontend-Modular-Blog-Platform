// projects/shell/src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ThemeService } from 'shared-lib';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, AsyncPipe],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <nav class="bg-white dark:bg-gray-800 shadow-sm">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <span class="text-xl font-semibold text-gray-800 dark:text-white">My Blog Platform</span>
            </div>
            <div class="flex items-center space-x-4">
              <button 
                (click)="themeService.toggleTheme()"
                class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
                @if (themeService.isDarkTheme$ | async) {
                  🌞
                } @else {
                  🌙
                }
              </button>
              <a [routerLink]="['/viewer']" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">View Blog</a>
              <a [routerLink]="['/manager']" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Manage Posts</a>
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
export class AppComponent {
  constructor(public themeService: ThemeService) {}
}