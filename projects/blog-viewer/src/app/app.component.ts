import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BlogService } from 'shared-lib';
import { Observable } from 'rxjs';
import { BlogPost } from 'shared-lib';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe],
  providers: [BlogService],  // Provide BlogService here
  template: `
    <div class="container mx-auto p-4">
      <h1>Blog Posts</h1>
      @if (posts$ | async; as posts) {
        @for (post of posts; track post.postId) {
          <div>
            <h2>{{ post.title }}</h2>
            <p>{{ post.content }}</p>
          </div>
        }
      }
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