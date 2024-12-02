import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService, BlogPost } from 'shared-lib';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Blog Posts</h1>
      
      @if (posts$ | async; as posts) {
        <div class="grid gap-6">
          @for (post of posts; track post.postId) {
            <article 
              class="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              [routerLink]="['/post', post.postId]">
              <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
              
              <div class="flex gap-2 mb-4">
                @for (tag of post.tags; track tag) {
                  <span class="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-full">
                    {{ tag }}
                  </span>
                }
              </div>
              
              <p class="text-gray-600 mb-4 line-clamp-3">
                {{ post.content }}
              </p>
            </article>
          }
        </div>
      } @else {
        <div class="flex justify-center items-center h-64">
          <p class="text-gray-500">Loading posts...</p>
        </div>
      }
    </div>
  `
})
export class PostListComponent implements OnInit {
  posts$!: Observable<BlogPost[]>;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.posts$ = this.blogService.getPosts();
  }
}