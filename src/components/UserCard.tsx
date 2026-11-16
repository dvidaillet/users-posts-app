import type { User } from "../types/user";

interface UserCardProps {
  user: User;
  isSelected: boolean;
  onSelect: (user: User) => void;
}

export function UserCard({
  user,
  isSelected,
  onSelect,
}: UserCardProps) {
  return (
    <button
      type="button"
      className={`user-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(user)}
      aria-pressed={isSelected}
    >
      <h3>{user.name}</h3>
      <p>@{user.username}</p>
      <p>{user.email}</p>
    </button>
  );
}