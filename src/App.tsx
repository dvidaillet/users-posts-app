import { useEffect, useState } from "react";

import { getUsers } from "./api/users";
import { createPost } from "./api/posts";
import { getPostsByUser } from "./api/posts";

import { UserCard } from "./components/UserCard";
import { PostList } from "./components/PostList";
import { PostForm } from "./components/PostForm";

import type { User } from "./types/user";
import type { Post } from "./types/post";

function App() {
  // Usuarios
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Búsqueda
  const [search, setSearch] = useState("");

  // Usuario seleccionado
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Publicaciones
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  const [createError, setCreateError] = useState<string | null>(null);
  const [localPosts, setLocalPosts] = useState<Post[]>([]);

  async function handleCreatePost(
    title: string,
    body: string,
  ): Promise<boolean> {
    if (!selectedUser) {
      return false;
    }

    const userId = selectedUser.id;

    setCreateError(null);

    try {
      const newPost = await createPost({
        userId,
        title,
        body,
      });

      setLocalPosts((currentPosts) => [
        {
          ...newPost,
          id: -Date.now(),
          userId,
          title,
          body,
        },
        ...currentPosts,
      ]);

      return true;
    } catch {
      setCreateError("No se pudo crear la publicación. Inténtalo nuevamente.");
      return false;
    }
  }

  // Obtener usuarios
  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        setLoadingUsers(true);
        setUsersError(null);

        const data = await getUsers();

        if (active) {
          setUsers(data);
        }
      } catch {
        if (active) {
          setUsersError("No se pudieron cargar los usuarios");
        }
      } finally {
        if (active) {
          setLoadingUsers(false);
        }
      }
    }

    void loadUsers();

    return () => {
      active = false;
    };
  }, []);

  // Obtener publicaciones cuando cambia el usuario
  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    let active = true;

    async function loadPosts() {
      try {
        setLoadingPosts(true);
        setPostsError(null);
        setPosts([]);

        const data = await getPostsByUser(selectedUser!.id);

        if (active) {
          setPosts(data);
        }
      } catch {
        if (active) {
          setPostsError("No se pudieron cargar las publicaciones");
        }
      } finally {
        if (active) {
          setLoadingPosts(false);
        }
      }
    }

    void loadPosts();

    return () => {
      active = false;
    };
  }, [selectedUser]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const visiblePosts = selectedUser
    ? [
        ...localPosts.filter((post) => post.userId === selectedUser.id),
        ...posts,
      ]
    : [];

  return (
    <main className="container">
      <header>
        <h1>Users & Posts</h1>
        <p>Explora usuarios y sus publicaciones</p>
      </header>

      <div className="app-layout">
        <section>
          <h2>Usuarios</h2>

          <div className="search-section">
            <label htmlFor="user-search">Buscar usuarios</label>

            <input
              id="user-search"
              type="search"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {loadingUsers && <p role="status">Cargando usuarios...</p>}

          {usersError && (
            <p role="alert" className="error">
              {usersError}
            </p>
          )}

          {!loadingUsers && !usersError && (
            <>
              <p>{filteredUsers.length} usuarios encontrados</p>

              <div className="users-grid">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    isSelected={selectedUser?.id === user.id}
                    onSelect={(user) => {
                      setCreateError(null);
                      setSelectedUser(user);
                    }}
                  />
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <p className="empty-state">No se encontraron usuarios.</p>
              )}
            </>
          )}
        </section>

        <section>
          <h2>Publicaciones</h2>

          {!selectedUser ? (
            <p className="empty-state">
              Selecciona un usuario para ver sus publicaciones.
            </p>
          ) : (
            <>
              <p className="selected-user-name">
                Publicaciones de {selectedUser.name}
              </p>

              <PostForm key={selectedUser.id} onSubmit={handleCreatePost} />

              {createError && (
                <p role="alert" className="error">
                  {createError}
                </p>
              )}

              <PostList
                posts={visiblePosts}
                loading={loadingPosts}
                error={postsError}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
