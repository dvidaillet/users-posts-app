import { useState } from "react";

interface PostFormProps {
  onSubmit: (
    title: string,
    body: string
  ) => Promise<boolean>;
}

export function PostForm({ onSubmit }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [errors, setErrors] = useState({
    title: "",
    body: "",
  });

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const newErrors = {
      title: title.trim() ? "" : "El título es obligatorio",
      body: body.trim() ? "" : "El contenido es obligatorio",
    };

    setErrors(newErrors);

    if (newErrors.title || newErrors.body) {
      return;
    }

    setSubmitting(true);

    try {
      const success = await onSubmit(
        title.trim(),
        body.trim()
      );

      if (success) {
        setTitle("");
        setBody("");
        setErrors({ title: "", body: "" });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      <h3>Nueva publicación</h3>

      <div className="form-field">
        <label htmlFor="post-title">Título *</label>

        <input
          id="post-title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setErrors((prev) => ({ ...prev, title: "" }));
          }}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "title-error" : undefined}
        />

        {errors.title && (
          <p id="title-error" className="field-error">
            {errors.title}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="post-body">Contenido *</label>

        <textarea
          id="post-body"
          rows={4}
          value={body}
          onChange={(event) => {
            setBody(event.target.value);
            setErrors((prev) => ({ ...prev, body: "" }));
          }}
          aria-invalid={Boolean(errors.body)}
          aria-describedby={errors.body ? "body-error" : undefined}
        />

        {errors.body && (
          <p id="body-error" className="field-error">
            {errors.body}
          </p>
        )}
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Publicando..." : "Crear publicación"}
      </button>
    </form>
  );
}