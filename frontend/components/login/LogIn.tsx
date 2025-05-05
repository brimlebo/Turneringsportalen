"use client";

import { login } from "@/components/login/actions";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";

export default function LoginDialog() {
  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form data
    const formData = new FormData();
    formData.append("email", inputFields.email);
    formData.append("password", inputFields.password);

    //Call to authentication logic here
    await login(formData);

    console.log("Login attempt with:", inputFields.email, inputFields.password);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          size="3"
          style={{
            border: "1px solid var(--highlighter2)",
            color: "var(--highlighter2)",
            backgroundColor: "var(--secondaryBg)",
          }}
        >
          Log in
        </Button>
      </Dialog.Trigger>
      <Dialog.Content
        style={{ maxWidth: "450px", backgroundColor: "var(--mainBg)" }}
      >
        <Dialog.Title style={{ color: "var(--highlighter2)" }}>
          Log in to Turneringsportalen
        </Dialog.Title>
        <Dialog.Description
          style={{ color: "var(--highlighter1)" }}
          size="2"
          mb="4"
        >
          Enter your credentials to access your account.
        </Dialog.Description>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text
                as="div"
                size="2"
                mb="1"
                weight="bold"
                style={{ color: "var(--highlighter2)" }}
              >
                Email
              </Text>
              <TextField.Root
                type="email"
                id="user_email"
                name="email"
                value={inputFields.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={{ backgroundColor: "var(--input-color)" }}
              />
            </label>
            <label>
              <Text
                as="div"
                size="2"
                mb="1"
                weight="bold"
                style={{ color: "var(--highlighter2)" }}
              >
                Password
              </Text>
              <TextField.Root
                type="password"
                id="user_password"
                name="password"
                value={inputFields.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{ backgroundColor: "var(--input-color)" }}
              />
            </label>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button
                style={{
                  backgroundColor: "var(--tertiaryColor)",
                  color: "var(--text-color)",
                }}
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              type="submit"
              style={{
                backgroundColor: "var(--highlighter3)",
                color: "var(--text-color)",
              }}
            >
              Log in
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
