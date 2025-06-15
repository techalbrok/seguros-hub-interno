
import { Delegation } from "@/types";
import { DelegationCard } from "@/components/DelegationCard";

interface DelegationsGridProps {
  delegations: Delegation[];
  onEdit: (delegation: Delegation) => void;
  onDelete: (delegationId: string) => void;
  onView: (delegation: Delegation) => void;
}

export const DelegationsGrid = ({ delegations, onEdit, onDelete, onView }: DelegationsGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {delegations.map((delegation) => (
      <DelegationCard
        key={delegation.id}
        delegation={delegation}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    ))}
  </div>
);
