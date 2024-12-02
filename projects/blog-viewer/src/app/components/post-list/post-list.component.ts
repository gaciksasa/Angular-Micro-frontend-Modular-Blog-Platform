import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService, BlogPost } from 'shared-lib';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink, FormsModule],
  templateUrl: './post-list.component.html'
})
export class PostListComponent implements OnInit {
  posts$!: Observable<BlogPost[]>;
  searchTerm = '';
  private searchSubject = new BehaviorSubject<string>('');
  filteredPosts$!: Observable<BlogPost[]>;
  error: string | null = null;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.posts$ = this.blogService.getPosts();
    this.setupSearch();
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  private setupSearch() {
    this.filteredPosts$ = combineLatest([
      this.posts$,
      this.searchSubject.asObservable()
    ]).pipe(
      map(([posts, term]) => {
        const searchTerm = term.toLowerCase();
        return posts.filter(post => 
          post.title.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      })
    );
  }

  loadPosts(): void {
    this.error = null;
    this.posts$ = this.blogService.getPosts();
  }
}