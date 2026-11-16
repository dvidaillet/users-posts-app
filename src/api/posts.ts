import type { Post } from "../types/post";

const API_URL = "https://jsonplaceholder.typicode.com";

export async function getPostsByUser(userId: number): Promise<Post[]> {
  const response = await fetch(`${API_URL}/posts?userId=${userId}`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar las publicaciones");
  }

  const data: Post[] = await response.json();

  return data;
}

export async function createPost(post: Omit<Post, "id">): Promise<Post> {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear la publicación");
  }

  const data: Post = await response.json();

  return data;
}
