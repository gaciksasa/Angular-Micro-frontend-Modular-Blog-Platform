import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { BlogPost, BlogState, CreateBlogPost } from '../interfaces/blog.interfaces';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:3000';
  
  private state = new BehaviorSubject<BlogState>({
    posts: [],
    loading: false
  });

  constructor(private http: HttpClient) {}

  getState(): Observable<BlogState> {
    return this.state.asObservable();
  }

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