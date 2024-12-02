import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService, BlogPost, User } from 'shared-lib';
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
  authors$!: Observable<User[]>;
  searchTerm = '';
  selectedAuthor = '';
  private searchSubject = new BehaviorSubject<string>('');
  private authorSubject = new BehaviorSubject<string>('');
  filteredPosts$!: Observable<BlogPost[]>;
  error: string | null = null;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.posts$ = this.blogService.getPosts();
    this.authors$ = this.blogService.getAuthors();
    this.setupSearch();
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  onAuthorChange(authorId: string) {
    this.authorSubject.next(authorId);
  }

  private setupSearch() {
    this.filteredPosts$ = combineLatest([
      this.posts$,
      this.searchSubject.asObservable(),
      this.authorSubject.asObservable()
    ]).pipe(
      map(([posts, searchTerm, authorId]) => {
        const term = searchTerm.toLowerCase();
        return posts
          // Filter published posts
          .filter(post => post.status === 'Published')
          // Filter by author if selected
          .filter(post => !authorId || post.authorId === authorId)
          // Filter by search term
          .filter(post => 
            post.title.toLowerCase().includes(term) ||
            post.content.toLowerCase().includes(term) ||
            post.tags.some(tag => tag.toLowerCase().includes(term))
          );
      })
    );
  }

  loadPosts(): void {
    this.error = null;
    this.posts$ = this.blogService.getPosts();
  }
}