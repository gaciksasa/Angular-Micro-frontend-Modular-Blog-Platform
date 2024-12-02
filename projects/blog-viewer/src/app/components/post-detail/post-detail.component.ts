import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService, BlogPost, User } from 'shared-lib';
import { Observable, switchMap, map } from 'rxjs';

interface PostWithAuthor extends BlogPost {
  authorName?: string;
}

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './post-detail.component.html'
})
export class PostDetailComponent implements OnInit {
  post$!: Observable<PostWithAuthor>;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.post$ = this.route.params.pipe(
      switchMap(params => this.blogService.getPost(params['id'])),
      switchMap(post => 
        this.blogService.getUser(post.authorId).pipe(
          map(user => ({
            ...post,
            authorName: user.name
          }))
        )
      )
    );
  }
}

export default PostDetailComponent;