export interface BlogPost {
  id?: string;
  postId: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  status: 'Draft' | 'Published';
}

export type CreateBlogPost = Pick<BlogPost, 'title' | 'content' | 'tags' | 'status' | 'authorId'>;
export type UpdateBlogPost = Partial<CreateBlogPost>;
export interface BlogState {
  posts: BlogPost[];
  selectedPost?: BlogPost;
  loading: boolean;
  error?: string;
}