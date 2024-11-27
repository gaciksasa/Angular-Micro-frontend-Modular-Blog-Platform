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
    <div class="mb-4">
      <button 
        class="bg-blue-500 text-white px-4 py-2 rounded"
        [routerLink]="['/new']">
        Create New Post
      </button>
    </div>

    <div class="grid gap-4">
      @if (posts$ | async; as posts) {
        @for (post of posts; track post.postId) {
          <div class="border p-4 rounded flex justify-between items-center">
            <div>
              <h3 class="text-xl font-semibold">{{ post.title }}</h3>
              <p class="text-gray-600">Status: {{ post.status }}</p>
              <div class="flex gap-2 mt-2">
                @for (tag of post.tags; track tag) {
                  <span class="bg-gray-200 px-2 py-1 rounded-full text-sm">
                    {{ tag }}
                  </span>
                }
              </div>
            </div>
            <div class="flex gap-2">
              <button 
                class="bg-blue-500 text-white px-3 py-1 rounded"
                [routerLink]="['/edit', post.postId]">
                Edit
              </button>
              <button 
                class="bg-red-500 text-white px-3 py-1 rounded"
                (click)="deletePost(post.postId)">
                Delete
              </button>
            </div>
          </div>
        }
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

  deletePost(postId: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogService.deletePost(postId).subscribe({
        next: () => {
          // Refresh the posts list
          this.posts$ = this.blogService.getPosts();
        },
        error: (error) => {
          console.error('Error deleting post:', error);
          alert('Failed to delete post.');
        }
      });
    }
  }
}