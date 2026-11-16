import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";
import { getUsers } from "./api/users";
import { getPostsByUser } from "./api/posts";

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

    expect(
      await screen.findByText("Leanne Graham")
    ).toBeInTheDocument();

    await user.type(
      screen.getByRole("searchbox"),
      "Ervin"
    );

    expect(
      screen.getByText("Ervin Howell")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Leanne Graham")
    ).not.toBeInTheDocument();
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
    })
  );

  expect(
    await screen.findByText("Publicación de prueba")
  ).toBeInTheDocument();

  expect(getPostsByUser).toHaveBeenCalledWith(1);
});
});