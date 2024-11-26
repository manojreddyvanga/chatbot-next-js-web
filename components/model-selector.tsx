"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full md:w-[200px]">
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
        <SelectItem value="gpt-4">GPT-4</SelectItem>
        <SelectItem value="claude-2">Claude 2</SelectItem>
      </SelectContent>
    </Select>
  );
}