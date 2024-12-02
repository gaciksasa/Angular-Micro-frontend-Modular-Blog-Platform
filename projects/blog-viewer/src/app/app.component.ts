import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BlogService } from 'shared-lib';
import { Observable } from 'rxjs';
import { BlogPost } from 'shared-lib';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  providers: [BlogService], 
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Blog Posts</h1>
      <div class="grid gap-4">
      @if (posts$ | async; as posts) {
        @for (post of posts; track post.postId) {
        <div>
          <div class="border p-4 rounded flex justify-between items-center hover:bg-gray-50">
            <h3 class="text-xl font-semibold">{{ post.title }}</h3>
            <p class="text-gray-600">{{ post.content }}</p>
          </div>
        </div>
        }
      }
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  posts$!: Observable<BlogPost[]>;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.posts$ = this.blogService.getPosts();
  }
}