import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService, BlogPost } from 'shared-lib';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-manage',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './post-list-manage.component.html'
})
export class PostListManageComponent implements OnInit {
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