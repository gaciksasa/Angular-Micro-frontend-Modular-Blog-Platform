import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { BlogService, BlogPost } from 'shared-lib';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterModule],
  template: `
    <div class="mb-4">
      <button 
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        [routerLink]="['/new']">
        Create New Post
      </button>
    </div>

    @if (error) {
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>
    }

    <div class="grid gap-4">
      @if (posts$ | async; as posts) {
        @for (post of posts; track post.postId) {
          <div class="border p-4 rounded flex justify-between items-center hover:bg-gray-50">
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
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                [routerLink]="['/edit', post.postId]">
                Edit
              </button>
              <button 
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                (click)="deletePost(post.postId)">
                Delete
              </button>
            </div>
          </div>
        }
      } @else {
        <div class="text-center py-8">
          <p>Loading posts...</p>
        </div>
      }
    </div>
  `
})
export class PostListComponent implements OnInit {
  posts$!: Observable<BlogPost[]>;
  error: string | null = null;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.error = null;
    this.posts$ = this.blogService.getPosts();
  }

  deletePost(postId: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.error = null;
      this.blogService.deletePost(postId).subscribe({
        next: () => {
          // Post is already removed from state in the service
          this.loadPosts();
        },
        error: (error) => {
          if (error.message === 'Post was already deleted') {
            // Just refresh the list
            this.loadPosts();
          } else {
            this.error = 'Failed to delete post. Please try again.';
          }
        }
      });
    }
  }
}