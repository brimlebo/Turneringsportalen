import { Button, DropdownMenu } from "@radix-ui/themes";
import { useState } from "react";

// Props sent to the MultiSelect component
type MultiSelectProps = {
  triggerText: string;
  items: { key: string | number; text: string }[];
  onSelectionChange: (selectedKeys: (string | number)[]) => void; // New prop
};

/**
 * MultiSelect component that allows multiple items to be selected from a dropdown list
 * @param object containing the triggerText, items, and onSelectionChange defined in the MultiSelectProps type
 * @returns a DropdownMenu component with a trigger button and a list of items that can be selected
 */
export function MultiSelect({
  triggerText,
  items,
  onSelectionChange,
}: MultiSelectProps) {
  // State to keep track of which items are checked
  const [checkedItems, setCheckedItems] = useState<
    Record<string | number, boolean>
  >(items.reduce((acc, item) => ({ ...acc, [item.key]: true }), {}));

  /**
   * Handle the selection of an item in the dropdown
   * @param key selected item key
   * @param event the click event on the dropdown item
   */
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

  /**
   * Toggle all items to be checked or unchecked
   * @param event the click event on the dropdown item
   */
  const handleToggleAll = (event: Event) => {
    event.preventDefault(); // Prevent the dropdown from closing

    // Check if all items are checked
    const allChecked = Object.values(checkedItems).every(
      (isChecked) => isChecked
    );

    // If all items are checked, uncheck all items; otherwise, check all items
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
        <Button
          style={{
            border: "1px solid var(--highlighter2)",
            color: "var(--highlighter2)",
            backgroundColor: "var(--secondaryBg)",
          }}
        >
          {triggerText}
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content color="tomato">
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
