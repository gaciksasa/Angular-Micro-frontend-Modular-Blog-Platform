import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService, BlogPost, User } from 'shared-lib';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

type SortOption = 'dateDesc' | 'dateAsc' | 'titleAsc' | 'titleDesc';

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
  selectedSort: SortOption = 'dateDesc';
  private searchSubject = new BehaviorSubject<string>('');
  private authorSubject = new BehaviorSubject<string>('');
  private sortSubject = new BehaviorSubject<SortOption>('dateDesc');
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

  onSortChange(sort: SortOption) {
    this.sortSubject.next(sort);
  }

  private setupSearch() {
    this.filteredPosts$ = combineLatest([
      this.posts$,
      this.searchSubject.asObservable(),
      this.authorSubject.asObservable(),
      this.sortSubject.asObservable()
    ]).pipe(
      map(([posts, searchTerm, authorId, sortOption]) => {
        const term = searchTerm.toLowerCase();
        let filtered = posts
          .filter(post => post.status === 'Published')
          .filter(post => !authorId || post.authorId === authorId)
          .filter(post => 
            post.title.toLowerCase().includes(term) ||
            post.content.toLowerCase().includes(term) ||
            post.tags.some(tag => tag.toLowerCase().includes(term))
          );
        
        return this.sortPosts(filtered, sortOption);
      })
    );
  }

  private sortPosts(posts: BlogPost[], sortOption: SortOption): BlogPost[] {
    switch (sortOption) {
      case 'dateDesc':
        return [...posts].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'dateAsc':
        return [...posts].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case 'titleAsc':
        return [...posts].sort((a, b) => 
          a.title.localeCompare(b.title)
        );
      case 'titleDesc':
        return [...posts].sort((a, b) => 
          b.title.localeCompare(a.title)
        );
      default:
        return posts;
    }
  }

  loadPosts(): void {
    this.error = null;
    this.posts$ = this.blogService.getPosts();
  }
}