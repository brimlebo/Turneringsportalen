"use client";

import { signup } from "@/components/login/actions";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, Text, TextField, RadioGroup, HoverCard, Link, Avatar, Box, Heading, Callout } from "@radix-ui/themes";
import { useState } from "react";

export default function SignUp() {
  const [inputFields, setInputFields] = useState({
    email: "",
    password: "",
    username: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputFields({ ...inputFields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error when user starts typing
    validateForm();
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "", username: "" };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputFields.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Username validation
    if (!inputFields.username.trim()) {
      newErrors.username = "Username is required.";
    }

    // Password validation
    if (inputFields.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    setErrors(newErrors);

    // Return true if no errors
    return !newErrors.email && !newErrors.password && !newErrors.username;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    // Form data
    const formData = new FormData();
    formData.append("email", inputFields.email);
    formData.append("password", inputFields.password);
    formData.append("username", inputFields.username);
    formData.append("role", inputFields.role);

    console.log("Sign up attempt with:", inputFields.email, inputFields.password, inputFields.username, inputFields.role);
    await signup(formData);
    setSuccessMessage(`Success! An email has been sent to ${inputFields.email}. Please check your inbox to validate your account.`);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button size="3">Sign up</Button>
      </Dialog.Trigger>
      <Dialog.Content style={{ maxWidth: "450px" }}>
        <Dialog.Title size="8">Sign up</Dialog.Title>
        <form onSubmit={handleSubmit}>
        {successMessage && (
          <Callout.Root color="green" role="alert" mb="4">
            <Callout.Icon>
              <ExclamationTriangleIcon />
            </Callout.Icon>
            <Callout.Text>{successMessage}</Callout.Text>
          </Callout.Root>
        )}
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
              {errors.password && <Text color="red">{errors.password}</Text>}
            </label>
            <label>
              <TextField.Root
                type="text"
                id="username"
                name="username"
                value={inputFields.username}
                onChange={handleChange}
                placeholder="Username"
              />
              {errors.username && <Text color="red">{errors.username}</Text>}
            </label>
            <label>
              <Text as="div" size="5" mb="1" weight="bold">
                Role
              </Text>
              <RadioGroup.Root
                name="role"
                defaultValue="regular_user"
                onValueChange={(value) => setInputFields({ ...inputFields, role: value })}
              >
                <RadioGroup.Item value="regular_user">
                  <Text>
                  <HoverCard.Root>
                    <HoverCard.Trigger>
                    <Text style={{ cursor: "pointer" }}>
                      Regular user
                    </Text>
                    </HoverCard.Trigger>
                    <HoverCard.Content maxWidth="300px">
                    <Flex gap="4">
                      <Avatar
                      size="3"
                      fallback="R"
                      radius="full"
                      src="/spectator.png"
                      />
                      <Box>
                      <Heading size="3" as="h3">
                        Regular user
                      </Heading>
                      <Text as="div" size="2">
                        A regular user can participate in tournaments.
                      </Text>
                      </Box>
                    </Flex>
                    </HoverCard.Content>
                  </HoverCard.Root>
                  </Text>
                </RadioGroup.Item>
                <RadioGroup.Item value="team_leader">
                  <Text>
                  <HoverCard.Root>
                    <HoverCard.Trigger>
                    <Text style={{ cursor: "pointer" }}>
                      Team manager
                    </Text>
                    </HoverCard.Trigger>
                    <HoverCard.Content maxWidth="300px">
                    <Flex gap="4">
                      <Avatar
                      size="3"
                      fallback="R"
                      radius="full"
                      src="/team_manager.png"
                      />
                      <Box>
                      <Heading size="3" as="h3">
                        Team manager
                      </Heading>
                      <Text as="div" size="2">
                        This account type will allow you to create and manage teams. You cal also register your teams for available tournaments.
                      </Text>
                      </Box>
                    </Flex>
                    </HoverCard.Content>
                  </HoverCard.Root>
                  </Text>
                </RadioGroup.Item>
                <RadioGroup.Item value="event_organizer">
                  <Text>
                  <HoverCard.Root>
                    <HoverCard.Trigger>
                    <Text style={{ cursor: "pointer" }}>
                      Event organizer
                    </Text>
                    </HoverCard.Trigger>
                    <HoverCard.Content maxWidth="300px">
                    <Flex gap="4">
                      <Avatar
                      size="3"
                      fallback="R"
                      radius="full"
                      src="/organizer.png"
                      />
                      <Box>
                      <Heading size="3" as="h3">
                        Event organizer
                      </Heading>
                      <Text as="div" size="2">
                        Will allow you to create tournaments, make registration forms, generate match schedules and much more.
                      </Text>
                      </Box>
                    </Flex>
                    </HoverCard.Content>
                  </HoverCard.Root>
                  </Text>
                </RadioGroup.Item>
              </RadioGroup.Root>
            </label>
            <Text as="div" size="3" mb="1">
                Hover over the roles to see a description.
              </Text>
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit" disabled={!inputFields.email || !inputFields.username || inputFields.password.length < 8}>
              Sign up
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
