import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";
import { getUsers } from "./api/users";
import { createPost, getPostsByUser } from "./api/posts";

vi.mock("./api/users", () => ({
  getUsers: vi.fn(),
}));

vi.mock("./api/posts", () => ({
  getPostsByUser: vi.fn(),
  createPost: vi.fn(),
}));

const mockUsers = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "leanne@example.com",
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "ervin@example.com",
  },
];

describe("App", () => {
  beforeEach(() => {
    vi.mocked(getUsers).mockResolvedValue(mockUsers);
    vi.mocked(getPostsByUser).mockResolvedValue([]);
  });

  it("filtra usuarios por nombre", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(await screen.findByText("Leanne Graham")).toBeInTheDocument();

    await user.type(screen.getByRole("searchbox"), "Ervin");

    expect(screen.getByText("Ervin Howell")).toBeInTheDocument();

    expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument();
  });

  it("muestra las publicaciones del usuario seleccionado", async () => {
    const user = userEvent.setup();

    vi.mocked(getPostsByUser).mockResolvedValue([
      {
        id: 101,
        userId: 1,
        title: "Publicación de prueba",
        body: "Contenido de la publicación",
      },
    ]);

    render(<App />);

    await user.click(
      await screen.findByRole("button", {
        name: /Leanne Graham/i,
      }),
    );

    expect(
      await screen.findByText("Publicación de prueba"),
    ).toBeInTheDocument();

    expect(getPostsByUser).toHaveBeenCalledWith(1);
  });

  it("muestra un error si falla la carga de usuarios", async () => {
    vi.mocked(getUsers).mockRejectedValue(new Error("Error de conexión"));

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudieron cargar los usuarios",
    );
  });

  it("muestra un error si fallan las publicaciones", async () => {
    const user = userEvent.setup();

    vi.mocked(getPostsByUser).mockRejectedValue(
      new Error("Error al obtener publicaciones"),
    );

    render(<App />);

    await user.click(
      await screen.findByRole("button", {
        name: /Leanne Graham/i,
      }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudieron cargar las publicaciones",
    );
  });

  it("crea una publicación y la muestra en la lista", async () => {
    const user = userEvent.setup();

    vi.mocked(createPost).mockResolvedValue({
      id: 101,
      userId: 1,
      title: "Aprendiendo React",
      body: "Mi primera publicación de prueba",
    });

    render(<App />);

    // Esperar a que aparezcan los usuarios
    await screen.findByText("Leanne Graham");

    // Seleccionar un usuario
    await user.click(
      screen.getByRole("button", {
        name: /Leanne Graham/i,
      }),
    );

    // Esperar a que termine la carga de publicaciones
    await screen.findByText("Este usuario no tiene publicaciones.");

    // Rellenar el formulario
    await user.type(screen.getByLabelText(/título/i), "Aprendiendo React");

    await user.type(
      screen.getByLabelText(/contenido/i),
      "Mi primera publicación de prueba",
    );

    // Enviar
    await user.click(
      screen.getByRole("button", {
        name: /crear publicación/i,
      }),
    );

    // Comprobar que aparece en la interfaz
    expect(await screen.findByText("Aprendiendo React")).toBeInTheDocument();

    expect(createPost).toHaveBeenCalledWith({
      userId: 1,
      title: "Aprendiendo React",
      body: "Mi primera publicación de prueba",
    });
  });
});
