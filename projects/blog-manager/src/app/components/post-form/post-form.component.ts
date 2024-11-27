import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService, CreateBlogPost, UpdateBlogPost } from 'shared-lib';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="max-w-2xl mx-auto">
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

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [''],
      status: ['Draft', Validators.required]
    });
  }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      this.isEditMode = true;
      this.blogService.getPost(this.postId).subscribe(post => {
        this.postForm.patchValue({
          title: post.title,
          content: post.content,
          tags: post.tags.join(', '),
          status: post.status
        });
      });
    }
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const formValue = this.postForm.value;
      const postData: CreateBlogPost = {
        title: formValue.title,
        content: formValue.content,
        tags: formValue.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
        status: formValue.status,
        authorId: 'u1'  // Using a default author ID
      };

      const operation = this.isEditMode ?
        this.blogService.updatePost(this.postId!, postData) :
        this.blogService.createPost(postData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error saving post:', error);
          alert('Failed to save post.');
        }
      });
    }
  }
}