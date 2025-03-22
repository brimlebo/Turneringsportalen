import { Button, DropdownMenu } from "@radix-ui/themes";
import { useState } from "react";

type MultiSelectProps = {
  triggerText: string;
  items: { key: string | number; text: string }[];
  onSelectionChange: (selectedKeys: (string | number)[]) => void; // New prop
};

export function MultiSelect({
  triggerText,
  items,
  onSelectionChange,
}: MultiSelectProps) {
  const [checkedItems, setCheckedItems] = useState<
    Record<string | number, boolean>
  >(items.reduce((acc, item) => ({ ...acc, [item.key]: true }), {})); // Initialize all as true

  const handleSelect = (key: string | number, event: Event) => {
    event.preventDefault(); // Prevent the dropdown from closing
    const updatedCheckedItems: Record<string | number, boolean> = {
      ...checkedItems,
      [key]: !checkedItems[key], // Toggle the checked state
    };
    setCheckedItems(updatedCheckedItems);

    // Notify parent component of the updated selection
    const selectedKeys = Object.keys(updatedCheckedItems).filter(
      (k) => updatedCheckedItems[k as string | number]
    );
    onSelectionChange(selectedKeys); // Pass only the selected keys
  };

  const handleToggleAll = (event: Event) => {
    event.preventDefault(); // Prevent the dropdown from closing
    const allChecked = Object.values(checkedItems).every(
      (isChecked) => isChecked
    );
    const updatedCheckedItems: Record<string | number, boolean> = items.reduce(
      (acc, item) => ({ ...acc, [item.key]: !allChecked }), // Toggle all to the opposite state
      {}
    );
    setCheckedItems(updatedCheckedItems);

    // Notify parent component of the updated selection
    const selectedKeys = Object.keys(updatedCheckedItems).filter(
      (k) => updatedCheckedItems[k]
    );
    onSelectionChange(selectedKeys);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft">
          {triggerText}
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {/* Add a "Check All / Uncheck All" option */}
        <DropdownMenu.Item onSelect={handleToggleAll}>
          {Object.values(checkedItems).every((isChecked) => isChecked)
            ? "Uncheck All"
            : "Check All"}
        </DropdownMenu.Item>
        {items.map((item) => (
          <DropdownMenu.CheckboxItem
            key={item.key}
            checked={checkedItems[item.key]}
            onSelect={(event) => handleSelect(item.key, event)}
          >
            {item.text}
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
