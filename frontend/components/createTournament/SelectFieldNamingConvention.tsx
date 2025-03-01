import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useState } from "react";
import NameFieldsDialog from "./NameFieldsDialog";

type SelectFieldNamingConventionProps = {
  // Props definition
  onSubmit: (fieldNames: string[]) => void;
  fieldCount: number;
};

export default function SelectFieldNamingConvention({
  onSubmit,
  fieldCount,
}: SelectFieldNamingConventionProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
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
          Create Tournament
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="600px" size="4">
        <Dialog.Title>How do you want to name your fields</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Do you want your fields to be a keyword and number (e.g. Field 1) or
          do you want to name each field individually?
        </Dialog.Description>

        <Flex style={{ gap: "20px" }} mt="4" justify="start">
          <Dialog.Close>
            <NameFieldsDialog
              triggerText={"Use keyword and number"}
              fieldCount={fieldCount}
              onSubmit={onSubmit}
              namingConvention="keyword"
              setOpen={setOpen}
            />
          </Dialog.Close>
          <Dialog.Close>
            <NameFieldsDialog
              triggerText={"Name each field individually"}
              fieldCount={fieldCount}
              onSubmit={onSubmit}
              namingConvention="individual"
              setOpen={setOpen}
            />
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
