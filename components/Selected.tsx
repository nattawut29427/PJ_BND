import React from "react";
import {Select, SelectItem} from "@nextui-org/react";

export const animals = [
  {key: "Admin", label: "Admin"},
  {key: "Staff", label: "Staff"},
  {key: "Customer", label: "Customer"},
];

export default function App() {
  const [value, setValue] = React.useState<string>("");

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="flex w-full  m-auto flex-col gap-2">
      <Select
        className="flex pt-6 "
        label="Role"
        placeholder="Select an role"
        selectedKeys={[value]}
        variant="bordered"
        onChange={handleSelectionChange}
        size="sm"
        radius="lg"
      >
        {animals.map((animal) => (
          <SelectItem key={animal.key}>{animal.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
