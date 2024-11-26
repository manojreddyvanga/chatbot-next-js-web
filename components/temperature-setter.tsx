"use client";

import { Slider } from './ui/slider';
import { Label } from './ui/label';

interface TemperatureSetterProps {
  value: number;
  onChange: (value: number) => void;
}

export function TemperatureSetter({ value, onChange }: TemperatureSetterProps) {
  return (
    <div className="flex flex-col space-y-2">
      <Label>Temperature: {value}</Label>
      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={0}
        max={1}
        step={0.1}
        className="w-full md:w-[200px]"
      />
    </div>
  );
}