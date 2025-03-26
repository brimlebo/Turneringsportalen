"use client";

import { login } from "@/app/login/actions";
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
        <Button variant="outline" size="3">Log in</Button>
      </Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: "450px" }}>
        <Dialog.Title>Log in to Turneringsportalen</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Enter your credentials to access your account.
        </Dialog.Description>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Email
              </Text>
              <TextField.Root
                type="email"
                id="user_email"
                name = "email"
                value={inputFields.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Password
              </Text>
              <TextField.Root
                type="password"
                id="user_password"
                name="password"
                value={inputFields.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </label>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit">Log in</Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
