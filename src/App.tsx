import { useEffect, useState } from "react";

import { getUsers } from "./api/users";
import type { User } from "./types/user";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        setLoading(true);
        setError(null);

        const data = await getUsers();

        if (active) {
          setUsers(data);
        }
      } catch {
        if (active) {
          setError("Ocurrió un error al cargar los usuarios");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Users & Posts</h1>
        <p>Explora los usuarios de JSONPlaceholder</p>
      </header>

      {loading && (
        <p role="status">Cargando usuarios...</p>
      )}

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}

      {!loading && !error && (
        <section>
          <h2>Usuarios ({users.length})</h2>

          <div className="users-grid">
            {users.map((user) => (
              <article key={user.id} className="user-card">
                <h3>{user.name}</h3>
                <p>@{user.username}</p>
                <p>{user.email}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default App;