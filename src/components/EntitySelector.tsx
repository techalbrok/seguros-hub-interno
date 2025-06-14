
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface EntitySelectorProps<T> {
  label: string;
  placeholder: string;
  entities: T[];
  selectedIds: string[];
  getEntityId: (entity: T) => string;
  getEntityName: (entity: T) => string;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}

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
