import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService, BlogPost } from 'shared-lib';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './post-detail.component.html'
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