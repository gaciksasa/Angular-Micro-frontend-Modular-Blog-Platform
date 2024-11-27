// projects/shared-lib/src/lib/interfaces/blog.interfaces.ts

export interface BlogPost {
  postId: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  status: 'Draft' | 'Published';
}

export interface User {
  userId: string;
  name: string;
  email: string;
  role: 'Editor' | 'Contributor';
}

export interface BlogState {
  posts: BlogPost[];
  selectedPost?: BlogPost;
  loading: boolean;
  error?: string;
}