import React from "react";

export type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

const presetColors = [
  "#1e1b4b", // dark purple
  "#18181b", // dark gray
  "#0f172a", // blue gray
  "#0a192f", // navy
  "#1e293b", // slate
  "#0d9488", // teal
  "#f59e42", // orange
  "#f43f5e", // pink
  "#a21caf", // purple
  "#2563eb", // blue
  "#059669", // green
  "#fbbf24", // yellow
];

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {presetColors.map((color) => (
        <button
          key={color}
          type="button"
          className="w-7 h-7 rounded-full border-2 border-white shadow focus:outline-none focus:ring-2 focus:ring-primary/50"
          style={{ background: color, outline: value === color ? "2px solid #6366f1" : undefined }}
          aria-label={`Select color ${color}`}
          onClick={() => onChange(color)}
        />
      ))}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-7 h-7 rounded-full border-2 border-white cursor-pointer p-0"
        aria-label="Custom color picker"
        style={{ background: value, padding: 0 }}
      />
    </div>
  );
}
