"use client";

import { signup } from "@/app/login/actions";
import { Button, Dialog, Flex, Text, TextField, RadioGroup, Card, Box, Inset, Strong } from "@radix-ui/themes";

import { useState } from "react";

export default function SignupDialogCardUser() {
  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
    username: "",
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
    formData.append("username", inputFields.username);
    formData.append("role", "regular_user");


    //Call to authentication logic here
    await signup(formData);


    // TODO: Add authentication logic here
    console.log("Sign up attempt with:", inputFields.email, inputFields.password, inputFields.username, formData);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Box>
          <Card>
            <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
              User
            </h2>
            
            <img
              src="/spectator.png"
              alt="Bold typography"
              style={{
                display: "block",
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
            <Text as="p" size="3">
              <Strong>Regular account</Strong> allows you to save your favorite tournaments and teams for quicker access.
            </Text>
          </Card>
        </Box>

      </Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: "450px" }}>
        <Dialog.Title>Sign up</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Create an account to save your favorite tournaments and teams and personalize your experience.
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
                name="email"
                value={inputFields.email}
                onChange={handleChange}
                placeholder="Email"
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
                placeholder="Password"
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Username
              </Text>
              <TextField.Root
                type="text"
                id="username"
                name="username"
                value={inputFields.username}
                onChange={handleChange}
                placeholder="Username"
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Account type
              </Text>
              <RadioGroup.Root
                name="role"
                defaultValue="regular_user"
              >
                <RadioGroup.Item value="regular_user" disabled>User</RadioGroup.Item>
                <RadioGroup.Item value="team_manager" disabled>Team Manager</RadioGroup.Item>
                <RadioGroup.Item value="event_organizer" disabled>Event Organizer</RadioGroup.Item>
              </RadioGroup.Root>
            </label>



          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit">Sign up</Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
