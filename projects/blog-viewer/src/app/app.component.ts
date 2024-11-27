import { Component, OnInit } from '@angular/core';
import { BlogService } from 'shared-lib';
import { Observable } from 'rxjs';
import { BlogPost } from 'shared-lib';

@Component({
  selector: 'app-root',
  template: `
    <div class="container mx-auto p-4">
      <h1>Blog Posts</h1>
      <div *ngFor="let post of posts$ | async">
        <h2>{{ post.title }}</h2>
        <p>{{ post.content }}</p>
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