import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useState } from "react";

type NameFieldsDialogProps = {
  namingConvention: string;
  fieldCount: number;
  onSubmit: (fieldNames: string[]) => void;
  triggerText: string;
  setOpen: (open: boolean) => void;
};

export default function NameFieldsDialog({
  namingConvention,
  fieldCount,
  onSubmit,
  triggerText,
  setOpen,
}: NameFieldsDialogProps) {
  const [inputFieldNames, setInputFieldNames] = useState<string[]>([]);

  // Function to update the state when the input fields change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const index = parseInt(name.split("_")[1], 10);
    const updatedFieldNames = [...inputFieldNames];
    updatedFieldNames[index] = value;
    setInputFieldNames(updatedFieldNames);
  }

  function handleSubmit() {
    if (namingConvention === "keyword") {
      const fieldNames = Array.from({ length: fieldCount }).map((_, index) => {
        return `${inputFieldNames[0]} ${index + 1}`;
      });
      onSubmit(fieldNames);
    } else {
      onSubmit(inputFieldNames);
    }
    setOpen(false);
  }

  // Common styles for the input fields
  const inputStyle = {
    color: "var(--text-color)",
    padding: "14px",
    borderRadius: "8px",
    backgroundColor: "var(--input-color)",
    border: "1px solid var(--border-color)",
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          style={{
            width: "fit-content",
            backgroundColor: "var(--submit-button-color)",
            color: "var(--text-color)",
            border: "1px solid var(--border-color)",
            padding: "24px",
            borderRadius: "16px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {triggerText}
        </Button>
      </Dialog.Trigger>

      <Dialog.Content size="4" maxWidth="600px">
        <Dialog.Title>
          {namingConvention === "keyword"
            ? "Name fields using keyword and number"
            : "Name each field individually"}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {namingConvention === "keyword"
            ? "Write your keyword below and we will automatically number your fields (e.g. Field 1, Field 2, etc.)"
            : "Write the name of each field below"}
        </Dialog.Description>

        {namingConvention === "keyword" ? (
          <Flex direction="column" gap="3">
            <label>
              Keyword:{" "}
              <input
                name="field_0"
                value={inputFieldNames[0] || ""}
                onChange={handleChange}
                placeholder="Enter a keyword for your fields"
                style={inputStyle}
              />
            </label>
          </Flex>
        ) : (
          Array.from({ length: fieldCount }).map((_, index) => (
            <Flex direction="column" gap="3" key={index}>
              <label>
                Field {index + 1}:{" "}
                <input
                  name={`field_${index}`}
                  value={inputFieldNames[index] || ""}
                  onChange={handleChange}
                  placeholder={`Enter name for field ${index + 1}`}
                  style={inputStyle}
                />
              </label>
            </Flex>
          ))
        )}
        <Flex style={{ gap: 16 }} mt="4" justify="start">
          <Dialog.Close>
            <Button
              style={{
                width: "fit-content",
                backgroundColor: "var(--submit-button-color)",
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
                padding: "20px",
                borderRadius: "16px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={() => setOpen(false)}
              variant="soft"
            >
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button
              style={{
                width: "fit-content",
                backgroundColor: "var(--submit-button-color)",
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
                padding: "20px",
                borderRadius: "16px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={() => handleSubmit()}
            >
              Save
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
