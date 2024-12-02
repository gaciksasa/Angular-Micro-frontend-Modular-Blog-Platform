import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService, CreateBlogPost, User } from 'shared-lib';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './post-form.component.html'
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
          this.router.navigate(['/manager']);
        },
        error: (error) => {
          this.error = 'Failed to save post. Please try again.';
          console.error('Error saving post:', error);
        }
      });
    }
  }
}