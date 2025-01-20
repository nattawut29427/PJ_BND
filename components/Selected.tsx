import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

type AppProps = {
  label: string;
  placeholder: string;
  options: { key: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
};

export default function App({
  label,
  placeholder,
  options,
  value,
  onChange,
}: AppProps) {
  return (
    <div className="flex w-full m-auto flex-col gap-2">
      <Select
        className="flex pt-6"
        label={label}
        placeholder={placeholder}
        selectedKeys={[value]}
        variant="bordered"
        onSelectionChange={(selected) =>
          onChange(Array.from(selected)[0]?.toString() || "")
        } // อัปเดต key
  
        size="sm"
        radius="lg"
      >
        {options.map((option) => (
          <SelectItem key={option.key}>{option.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
