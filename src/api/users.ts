import type { User } from "../types/user";

const API_URL = "https://jsonplaceholder.typicode.com";

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar los usuarios");
  }

  const data: User[] = await response.json();

  return data;
}