import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useState } from "react";
import NameFieldsDialog from "./NameFieldsDialog";

type SelectFieldNamingConventionProps = {
  // Props definition
  onSubmit: (fieldNames: string[]) => void;
  fieldCount: number;
  validateForm: () => boolean;
};

export default function SelectFieldNamingConvention({
  onSubmit,
  fieldCount,
  validateForm,
}: SelectFieldNamingConventionProps) {
  const [open, setOpen] = useState(false);

  function checkFormIsValid() {
    if (!validateForm()) {
      // Need the timeout for it to close after the trigger opens it
      setTimeout(() => {
        setOpen(false);
      }, 0);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button
          onClick={() => checkFormIsValid()}
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
          Create Tournament
        </Button>
      </Dialog.Trigger>

      <Dialog.Content
        maxWidth="600px"
        size="4"
        style={{ backgroundColor: "var(--mainBg)" }}
      >
        <Dialog.Title style={{ color: "var(--highlighter2)" }}>
          Naming of Fields
        </Dialog.Title>
        <Dialog.Description
          style={{ color: "var(--highlighter1)" }}
          size="2"
          mb="4"
        >
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
              setOpenPrev={setOpen}
            />
          </Dialog.Close>
          <Dialog.Close>
            <NameFieldsDialog
              triggerText={"Name each field individually"}
              fieldCount={fieldCount}
              onSubmit={onSubmit}
              namingConvention="individual"
              setOpenPrev={setOpen}
            />
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
