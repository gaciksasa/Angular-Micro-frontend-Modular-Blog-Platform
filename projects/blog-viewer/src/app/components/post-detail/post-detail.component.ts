import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService, BlogPost } from 'shared-lib';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <button 
        [routerLink]="['/']"
        class="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2">
        ← Back to Posts
      </button>

      @if (post$ | async; as post) {
        <article class="prose lg:prose-xl max-w-none">
          <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
          
          <div class="flex gap-2 mb-6">
            @for (tag of post.tags; track tag) {
              <span class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {{ tag }}
              </span>
            }
          </div>

          <div class="text-sm text-gray-600 mb-8">
            <p>Published: {{ post.createdAt | date:'mediumDate' }}</p>
            @if (post.updatedAt !== post.createdAt) {
              <p>Updated: {{ post.updatedAt | date:'mediumDate' }}</p>
            }
          </div>

          <div class="text-gray-800 leading-relaxed">
            {{ post.content }}
          </div>

          <div class="mt-8 pt-4 border-t">
            <p class="text-gray-600">Status: {{ post.status }}</p>
          </div>
        </article>
      } @else {
        <div class="flex justify-center items-center h-64">
          <p class="text-gray-500">Loading post...</p>
        </div>
      }
    </div>
  `
})
export class PostDetailComponent implements OnInit {
  post$!: Observable<BlogPost>;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.post$ = this.route.params.pipe(
      switchMap(params => this.blogService.getPost(params['id']))
    );
  }
}

export default PostDetailComponent;