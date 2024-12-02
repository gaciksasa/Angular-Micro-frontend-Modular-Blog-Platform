import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient  } from '@angular/common/http';
import { BlogService } from './services/blog.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule
  ],
  providers: [
    BlogService,
    provideHttpClient()
  ]
})
export class SharedLibModule { }