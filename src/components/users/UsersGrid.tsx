
import { UserCard } from "@/components/UserCard";
import { User, Delegation } from "@/types";

interface UsersGridProps {
  users: User[];
  delegations: Delegation[];
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const UsersGrid = ({ users, delegations, onViewUser, onEditUser, onDeleteUser }: UsersGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          delegations={delegations}
          onEdit={onEditUser}
          onDelete={onDeleteUser}
          onView={onViewUser}
        />
      ))}
    </div>
  );
};
