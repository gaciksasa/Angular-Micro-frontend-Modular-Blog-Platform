import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { BlogPost, BlogState, CreateBlogPost } from '../interfaces/blog.interfaces';
import { User } from '../interfaces/user.interfaces';

// Extended BlogState to include users
interface ExtendedBlogState extends BlogState {
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:3000';
  
  private state = new BehaviorSubject<ExtendedBlogState>({
    posts: [],
    users: [],
    loading: false
  });

  constructor(private http: HttpClient) {
    // Initialize users when service is created
    this.loadUsers().subscribe();
  }

  getState(): Observable<ExtendedBlogState> {
    return this.state.asObservable();
  }

  // User-related methods
  private loadUsers(): Observable<User[]> {
    this.state.next({ ...this.state.value, loading: true });
    
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        this.state.next({
          ...this.state.value,
          users,
          loading: false
        });
        return users;
      }),
      catchError(error => {
        console.error('Error loading users:', error);
        this.state.next({ ...this.state.value, loading: false });
        return throwError(() => error);
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => error);
      })
    );
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}/users?userId=${userId}`).pipe(
      map(users => {
        if (users.length === 0) {
          throw new Error('User not found');
        }
        return users[0];
      }),
      catchError(error => {
        console.error('Error fetching user:', error);
        return throwError(() => error);
      })
    );
  }

  // Existing post-related methods remain the same
  getPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/posts`);
  }

  getPost(postId: string): Observable<BlogPost> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/posts?postId=${postId}`).pipe(
      map(posts => {
        if (posts.length === 0) {
          throw new Error('Post not found');
        }
        return posts[0];
      }),
      catchError(error => {
        console.error('Error fetching post:', error);
        return throwError(() => error);
      })
    );
  }

  createPost(postData: CreateBlogPost): Observable<BlogPost> {
    const timestamp = Date.now();
    const newPost = {
      postId: `bp${timestamp}`,
      title: postData.title,
      content: postData.content,
      authorId: postData.authorId,
      tags: postData.tags,
      status: postData.status,
      createdAt: new Date(timestamp).toISOString(),
      updatedAt: new Date(timestamp).toISOString()
    };
    
    return this.http.post<BlogPost>(`${this.apiUrl}/posts`, newPost);
  }

  updatePost(postId: string, updateData: Partial<BlogPost>): Observable<BlogPost> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/posts?postId=${postId}`).pipe(
      switchMap(posts => {
        if (posts.length === 0) {
          return throwError(() => new Error('Post not found'));
        }
        const post = posts[0];
        const safeUpdate = {
          ...updateData,
          updatedAt: new Date().toISOString()
        };

        // Remove fields that shouldn't be updated
        delete safeUpdate.id;
        delete safeUpdate.postId;
        delete safeUpdate.createdAt;

        return this.http.patch<BlogPost>(`${this.apiUrl}/posts/${post.id}`, safeUpdate);
      }),
      catchError(error => {
        console.error('Error updating post:', error);
        return throwError(() => error);
      })
    );
  }

  deletePost(postId: string): Observable<void> {
    return this.http.get<BlogPost[]>(`${this.apiUrl}/posts?postId=${postId}`).pipe(
      switchMap(posts => {
        if (posts.length === 0) {
          return throwError(() => new Error('Post not found'));
        }
        const post = posts[0];
        return this.http.delete<void>(`${this.apiUrl}/posts/${post.id}`);
      }),
      catchError(error => {
        console.error('Error deleting post:', error);
        return throwError(() => error);
      })
    );
  }
}