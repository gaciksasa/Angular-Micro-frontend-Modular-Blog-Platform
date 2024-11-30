import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService, CreateBlogPost, UpdateBlogPost, User } from 'shared-lib';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="max-w-2xl mx-auto">
      @if (error) {
        <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ error }}
        </div>
      }

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Title</label>
        <input 
          type="text" 
          formControlName="title"
          class="w-full p-2 border rounded">
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Content</label>
        <textarea 
          formControlName="content"
          rows="6"
          class="w-full p-2 border rounded"></textarea>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Author</label>
        <select 
          formControlName="authorId"
          class="w-full p-2 border rounded">
          <option value="">Select Author</option>
          @for (user of users; track user.userId) {
            <option [value]="user.userId">{{ user.name }} ({{ user.role }})</option>
          }
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Tags (comma-separated)</label>
        <input 
          type="text" 
          formControlName="tags"
          class="w-full p-2 border rounded">
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Status</label>
        <select 
          formControlName="status"
          class="w-full p-2 border rounded">
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
      </div>

      <div class="flex gap-4">
        <button 
          type="submit"
          [disabled]="!postForm.valid"
          class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400">
          {{ isEditMode ? 'Update' : 'Create' }} Post
        </button>
        <button 
          type="button"
          routerLink="/"
          class="bg-gray-500 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  `
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  isEditMode = false;
  private postId: string | null = null;
  error: string | null = null;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      authorId: ['', Validators.required],
      tags: [''],
      status: ['Draft', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load available users
    this.blogService.getUsers().subscribe({
      next: (users: any) => {
        this.users = users;
      },
      error: (error: any) => {
        this.error = 'Failed to load users. Please try again.';
        console.error('Error loading users:', error);
      }
    });

    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      this.isEditMode = true;
      this.blogService.getPost(this.postId).subscribe({
        next: (post) => {
          this.postForm.patchValue({
            title: post.title,
            content: post.content,
            authorId: post.authorId,
            tags: post.tags.join(', '),
            status: post.status
          });
        },
        error: (error) => {
          this.error = 'Failed to load post. Please try again.';
          console.error('Error loading post:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      this.error = null;
      const formValue = this.postForm.value;
      const postData: CreateBlogPost = {
        title: formValue.title,
        content: formValue.content,
        authorId: formValue.authorId,
        tags: formValue.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
        status: formValue.status
      };

      const operation = this.isEditMode ?
        this.blogService.updatePost(this.postId!, postData) :
        this.blogService.createPost(postData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.error = 'Failed to save post. Please try again.';
          console.error('Error saving post:', error);
        }
      });
    }
  }
}