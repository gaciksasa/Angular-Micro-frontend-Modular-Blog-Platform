// projects/shared-lib/src/lib/services/blog.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map, finalize } from 'rxjs/operators';
import { BlogPost, BlogState, User } from '../interfaces/blog.interfaces';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:3000';
  
  // State Management
  private state = new BehaviorSubject<BlogState>({
    posts: [],
    loading: false
  });

  constructor(private http: HttpClient) {}

  // Get the current state as an observable
  getState(): Observable<BlogState> {
    return this.state.asObservable();
  }

  // Get all blog posts with error handling
  getPosts(): Observable<BlogPost[]> {
    this.setLoading(true);
    
    return this.http.get<BlogPost[]>(`${this.apiUrl}/posts`).pipe(
      tap(posts => {
        this.state.next({
          ...this.state.value,
          posts,
          error: undefined
        });
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }

  // Get a single blog post
  getPost(id: string): Observable<BlogPost> {
    this.setLoading(true);

    return this.http.get<BlogPost>(`${this.apiUrl}/posts/${id}`).pipe(
      tap(post => {
        this.state.next({
          ...this.state.value,
          selectedPost: post,
          error: undefined
        });
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }

  // Create a new blog post
  createPost(post: Omit<BlogPost, 'postId'>): Observable<BlogPost> {
    this.setLoading(true);

    const newPost = {
      ...post,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.http.post<BlogPost>(`${this.apiUrl}/posts`, newPost).pipe(
      tap(createdPost => {
        const currentPosts = this.state.value.posts;
        this.state.next({
          ...this.state.value,
          posts: [...currentPosts, createdPost],
          error: undefined
        });
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }

  // Update an existing blog post
  updatePost(id: string, post: Partial<BlogPost>): Observable<BlogPost> {
    this.setLoading(true);

    const updateData = {
      ...post,
      updatedAt: new Date().toISOString()
    };

    return this.http.put<BlogPost>(`${this.apiUrl}/posts/${id}`, updateData).pipe(
      tap(updatedPost => {
        const currentPosts = this.state.value.posts;
        const updatedPosts = currentPosts.map(p => 
          p.postId === id ? updatedPost : p
        );
        
        this.state.next({
          ...this.state.value,
          posts: updatedPosts,
          selectedPost: updatedPost,
          error: undefined
        });
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }

  // Delete a blog post
  deletePost(id: string): Observable<void> {
    this.setLoading(true);

    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`).pipe(
      tap(() => {
        const currentPosts = this.state.value.posts;
        this.state.next({
          ...this.state.value,
          posts: currentPosts.filter(p => p.postId !== id),
          selectedPost: undefined,
          error: undefined
        });
      }),
      catchError(this.handleError),
      finalize(() => this.setLoading(false))
    );
  }

  // Get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError(this.handleError)
    );
  }

  // Get posts by author
  getPostsByAuthor(authorId: string): Observable<BlogPost[]> {
    return this.getPosts().pipe(
      map(posts => posts.filter(post => post.authorId === authorId))
    );
  }

  // Get posts by status
  getPostsByStatus(status: 'Draft' | 'Published'): Observable<BlogPost[]> {
    return this.getPosts().pipe(
      map(posts => posts.filter(post => post.status === status))
    );
  }

  // Search posts by title or content
  searchPosts(searchTerm: string): Observable<BlogPost[]> {
    return this.getPosts().pipe(
      map(posts => posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  }

  // Private helper methods
  private setLoading(loading: boolean): void {
    this.state.next({
      ...this.state.value,
      loading
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    // Update state with error
    this.state.next({
      ...this.state.value,
      error: errorMessage
    });

    return throwError(() => new Error(errorMessage));
  }
}