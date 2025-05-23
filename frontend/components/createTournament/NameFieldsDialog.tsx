import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useState } from "react";

type NameFieldsDialogProps = {
  namingConvention: string;
  fieldCount: number;
  onSubmit: (fieldNames: string[]) => void;
  triggerText: string;
  setOpenPrev: (open: boolean) => void;
};

const fieldNamePattern = /^[A-Za-z0-9]+(?:\s[A-Za-z0-9]+)*$/;

export default function NameFieldsDialog({
  namingConvention,
  fieldCount,
  onSubmit,
  triggerText,
  setOpenPrev,
}: NameFieldsDialogProps) {
  const [inputFieldNames, setInputFieldNames] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  // Function to update the state when the input fields change
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const index = parseInt(name.split("_")[1], 10);
    const updatedFieldNames = [...inputFieldNames];
    updatedFieldNames[index] = value;
    setInputFieldNames(updatedFieldNames);
  }

  function handleSubmit() {
    // Validate all field names
    const isValid =
      namingConvention === "keyword"
        ? fieldNamePattern.test(inputFieldNames[0] || "") &&
          (inputFieldNames[0]?.length ?? 0) >= 2 &&
          (inputFieldNames[0]?.length ?? 0) <= 60
        : inputFieldNames.every(
            (name) =>
              fieldNamePattern.test(name || "") &&
              (name?.length ?? 0) >= 2 &&
              (name?.length ?? 0) <= 60
          );

    if (!isValid) {
      return;
    }

    if (namingConvention === "keyword") {
      const fieldNames = Array.from({ length: fieldCount }).map((_, index) => {
        return `${inputFieldNames[0]} ${index + 1}`;
      });
      onSubmit(fieldNames);
    } else {
      onSubmit(inputFieldNames);
    }
    setOpenPrev(false);
    setOpen(false);
  }

  // Common styles for the input fields
  const inputStyle = {
    color: "var(--highlighter1)",
    padding: "14px",
    borderRadius: "999px",
    backgroundColor: "var(--input-color)",
    border: "1px solid var(--border-color)",
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button
          style={{
            width: "fit-content",
            backgroundColor: "var(--highlighter3)",
            color: "var(--text-color)",
            padding: "20px",
            borderRadius: "9999px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {triggerText}
        </Button>
      </Dialog.Trigger>

      <Dialog.Content
        size="4"
        maxWidth="600px"
        style={{ backgroundColor: "var(--mainBg)" }}
      >
        <Dialog.Title style={{ color: "var(--highlighter2)" }}>
          {namingConvention === "keyword"
            ? "Name fields using keyword and number"
            : "Name each field individually"}
        </Dialog.Title>
        <Dialog.Description
          style={{ color: "var(--highlighter1)" }}
          size="2"
          mb="4"
        >
          {namingConvention === "keyword"
            ? "Write your keyword below and we will automatically number your fields (e.g. Field 1, Field 2, etc.)"
            : "Write the name of each field below"}
        </Dialog.Description>

        {namingConvention === "keyword" ? (
          <Flex direction="column" gap="3">
            <label style={{ color: "var(--highlighter2)" }}>
              Keyword:{" "}
              <input
                name="field_0"
                value={inputFieldNames[0] || ""}
                onChange={handleChange}
                placeholder="Enter a keyword for your fields"
                pattern="^[A-Za-z0-9]+(?:\s[A-Za-z0-9]+)*$"
                required
                minLength={2}
                maxLength={60}
                style={{
                  ...inputStyle,
                  borderColor: !fieldNamePattern.test(inputFieldNames[0] || "")
                    ? "red"
                    : "var(--border-color)",
                }}
              />
            </label>
          </Flex>
        ) : (
          Array.from({ length: fieldCount }).map((_, index) => (
            <Flex direction="column" gap="3" key={index}>
              <label style={{ color: "var(--highlighter2)" }}>
                Field {index + 1}:{" "}
                <input
                  name={`field_${index}`}
                  value={inputFieldNames[index] || ""}
                  onChange={handleChange}
                  placeholder={`Enter name for field ${index + 1}`}
                  pattern="^[A-Za-z0-9]+(?:\s[A-Za-z0-9]+)*$"
                  required
                  minLength={2}
                  maxLength={60}
                  style={{
                    ...inputStyle,
                    borderColor: !fieldNamePattern.test(
                      inputFieldNames[index] || ""
                    )
                      ? "red"
                      : "var(--border-color)",
                  }}
                />
              </label>
            </Flex>
          ))
        )}
        <Flex style={{ gap: 16 }} mt="4" justify="start">
          <Button
            style={{
              width: "fit-content",
              backgroundColor: "var(--tertiaryColor)",
              color: "var(--text-color)",
              padding: "20px",
              borderRadius: "9999px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={() => {
              setOpenPrev(false);
              setOpen(false);
            }}
            variant="soft"
          >
            Cancel
          </Button>
          <Button
            style={{
              width: "fit-content",
              backgroundColor: "var(--highlighter3)",
              color: "var(--text-color)",
              padding: "20px",
              borderRadius: "9999px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            onClick={() => handleSubmit()}
          >
            Save
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
