"use client";

import { signup } from "@/app/login/actions";
import { Button, Dialog, Flex, Text, TextField, RadioGroup } from "@radix-ui/themes";

import { useState } from "react";

export default function SignupDialog() {
  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
    username: "",
    role: "",
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
    formData.append("role", inputFields.role);

    
    //Call to authentication logic here
    await signup(formData);


    // TODO: Add authentication logic here
    console.log("Sign up attempt with:", inputFields.email, inputFields.password, inputFields.username, inputFields.role);
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
                Role
              </Text>
              <RadioGroup.Root
                name="role"
                defaultValue="regular_user"
                onValueChange={(value) => setInputFields({ ...inputFields, role: value })}
              >
                <RadioGroup.Item value="regular_user">Users</RadioGroup.Item>
                <RadioGroup.Item value="team_leader">Team leaders</RadioGroup.Item>
                <RadioGroup.Item value="event_organizer">Organizers</RadioGroup.Item>
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
