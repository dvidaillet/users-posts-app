import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PostForm } from "./PostForm";

describe("PostForm", () => {
  it("muestra errores si los campos están vacíos", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<PostForm onSubmit={onSubmit} />);

    await user.click(
      screen.getByRole("button", {
        name: /crear publicación/i,
      }),
    );

    expect(screen.getByText("El título es obligatorio")).toBeInTheDocument();

    expect(screen.getByText("El contenido es obligatorio")).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
  });
  it("envía los datos cuando el formulario es válido", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);

    render(<PostForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/título/i), "Mi primera publicación");

    await user.type(
      screen.getByLabelText(/contenido/i),
      "Aprendiendo React Testing Library",
    );

    await user.click(
      screen.getByRole("button", {
        name: /crear publicación/i,
      }),
    );

    expect(onSubmit).toHaveBeenCalledWith(
      "Mi primera publicación",
      "Aprendiendo React Testing Library",
    );
  });

  it("limpia los campos después de una creación exitosa", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);

    render(<PostForm onSubmit={onSubmit} />);

    const titleInput = screen.getByLabelText(/título/i);
    const bodyInput = screen.getByLabelText(/contenido/i);

    await user.type(titleInput, "Nuevo título");
    await user.type(bodyInput, "Nuevo contenido");

    await user.click(
      screen.getByRole("button", {
        name: /crear publicación/i,
      }),
    );

    expect(
      await screen.findByRole("button", {
        name: /crear publicación/i,
      }),
    ).toBeEnabled();

    expect(titleInput).toHaveValue("");
    expect(bodyInput).toHaveValue("");
  });
});
