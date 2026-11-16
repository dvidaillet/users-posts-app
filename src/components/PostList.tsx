import type { Post } from "../types/post";

interface PostListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export function PostList({
  posts,
  loading,
  error,
}: PostListProps) {
  if (loading) {
    return <p role="status">Cargando publicaciones...</p>;
  }

  if (error) {
    return <p role="alert" className="error">{error}</p>;
  }

  if (posts.length === 0) {
    return <p>Este usuario no tiene publicaciones.</p>;
  }

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <article key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  );
}