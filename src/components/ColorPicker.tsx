
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [open, setOpen] = useState(false);
  const [tempColor, setTempColor] = useState(color);

  const presetColors = [
    "#FF0000", "#FF4444", "#FF6B6B", "#FF8A80",
    "#1E2836", "#2C3E50", "#34495E", "#4A5568",
    "#3B82F6", "#60A5FA", "#93C5FD", "#DBEAFE",
    "#10B981", "#34D399", "#6EE7B7", "#A7F3D0",
    "#F59E0B", "#FBBF24", "#FCD34D", "#FEF3C7",
    "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE",
  ];

  const handleColorChange = (newColor: string) => {
    setTempColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-12 h-10 p-1 border-2"
            style={{ backgroundColor: color }}
          >
            <div className="w-full h-full rounded border border-white/20" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Color personalizado</label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={tempColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-10 h-10 border rounded cursor-pointer"
                />
                <Input
                  value={tempColor}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                      setTempColor(value);
                      if (value.length === 7) {
                        onChange(value);
                      }
                    }
                  }}
                  placeholder="#FF0000"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Colores predefinidos</label>
              <div className="grid grid-cols-8 gap-1">
                {presetColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => handleColorChange(presetColor)}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Input
        value={color}
        onChange={(e) => {
          const value = e.target.value;
          if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
            setTempColor(value);
            if (value.length === 7) {
              onChange(value);
            }
          }
        }}
        placeholder="#FF0000"
        className="w-24"
      />
    </div>
  );
};
