import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService, BlogPost } from 'shared-lib';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './post-list.component.html'
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
}