
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

/**
 * Props for the EntitySelector component.
 * @template T - The type of the entity being selected.
 */
interface EntitySelectorProps<T> {
  /** The label for the selector input. */
  label: string;
  /** The placeholder text for the select trigger. */
  placeholder: string;
  /** The list of all available entities. */
  entities: T[];
  /** An array of IDs of the currently selected entities. */
  selectedIds: string[];
  /** A function to get a unique ID from an entity object. */
  getEntityId: (entity: T) => string;
  /** A function to get the display name from an entity object. */
  getEntityName: (entity: T) => string;
  /** Callback function invoked when a new entity is selected from the dropdown. */
  onAdd: (id: string) => void;
  /** Callback function invoked when a selected entity's remove icon is clicked. */
  onRemove: (id: string) => void;
}

/**
 * A generic component for selecting one or more entities from a list.
 * Displays selected entities as badges with a remove button.
 * @template T - The type of the entity.
 */
export const EntitySelector = <T,>({
  label,
  placeholder,
  entities,
  selectedIds,
  getEntityId,
  getEntityName,
  onAdd,
  onRemove
}: EntitySelectorProps<T>) => {
  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-2">
        <Select onValueChange={onAdd}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {entities
              .filter(entity => !selectedIds.includes(getEntityId(entity)))
              .map((entity) => (
                <SelectItem key={getEntityId(entity)} value={getEntityId(entity)}>
                  {getEntityName(entity)}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-2">
          {selectedIds.map(id => {
            const entity = entities.find(e => getEntityId(e) === id);
            return entity ? (
              <Badge key={id} variant="secondary" className="flex items-center gap-1">
                {getEntityName(entity)}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => onRemove(id)}
                />
              </Badge>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};
