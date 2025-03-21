"use client";

import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";

export default function SignupDialog() {
  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
    username: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    console.log("Sign up attempt with:", inputFields.email, inputFields.password, inputFields.username);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button size="3">Sign up</Button>
      </Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: "450px" }}>
        <Dialog.Title>Sign up</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Create an account to create and administer tournaments.
        </Dialog.Description>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <TextField.Root
                type="email"
                id="user_email"
                name="email"
                value={inputFields.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </label>
            <label>
              <TextField.Root
                type="password"
                id="user_password"
                name="password"
                value={inputFields.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </label>
            <label>
              <TextField.Root
                type="text"
                id="username"
                name = "username"
                value={inputFields.username}
                onChange={handleChange}
                placeholder="Username"
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
