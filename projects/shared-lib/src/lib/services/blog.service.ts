import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { BlogPost, BlogState } from '../interfaces/blog.interfaces';

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
}