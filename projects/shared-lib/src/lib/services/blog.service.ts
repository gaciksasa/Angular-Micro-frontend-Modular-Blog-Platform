import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { BlogPost, BlogState, CreateBlogPost, UpdateBlogPost } from '../interfaces/blog.interfaces';

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

  getPost(id: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/posts/${id}`);
  }

  createPost(post: CreateBlogPost): Observable<BlogPost> {
    const newPost = {
      ...post,
      postId: `bp${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return this.http.post<BlogPost>(`${this.apiUrl}/posts`, newPost);
  }

  updatePost(id: string, post: UpdateBlogPost): Observable<BlogPost> {
    const updateData = {
      ...post,
      updatedAt: new Date().toISOString()
    };
    
    return this.http.put<BlogPost>(`${this.apiUrl}/posts/${id}`, updateData);
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);
  }
}