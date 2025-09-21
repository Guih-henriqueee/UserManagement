import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFieldProps {
  value: any;
  onChange: (value: string) => void;
  options: { id: string | number; label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  value,
  onChange,
  options,
  placeholder = "Selecione uma opção",
  disabled = false,
}) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-gray-500">
        {options.map((option) => (
          <SelectItem key={option.id} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
