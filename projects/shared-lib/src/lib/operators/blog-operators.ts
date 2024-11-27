// projects/shared-lib/src/lib/operators/blog-operators.ts
import { Observable, pipe } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { BlogPost } from '../interfaces/blog.interfaces';

// Filter out draft posts for non-editor users
export function filterPublishedPosts() {
  return pipe(
    map((posts: BlogPost[]) => 
      posts.filter(post => post.status === 'Published')
    )
  );
}

// Sort posts by date
export function sortPostsByDate(ascending: boolean = false) {
  return pipe(
    map((posts: BlogPost[]) => 
      [...posts].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return ascending ? dateA - dateB : dateB - dateA;
      })
    )
  );
}

// Filter posts by tags
export function filterByTags(tags: string[]) {
  return pipe(
    map((posts: BlogPost[]) =>
      posts.filter(post => 
        tags.some(tag => post.tags.includes(tag))
      )
    )
  );
}