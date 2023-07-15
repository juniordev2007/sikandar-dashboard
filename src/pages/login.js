/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TextInput, PasswordInput, Text, Paper, Group, Button, Stack, Center } from "@mantine/core";
import { auth } from "@/utils/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await auth.signInWithEmailAndPassword(email, password);
      localStorage.setItem("isLoggedIn", true);
      setEmail("");
      setpassword("");
      router.replace("/dashboard");
      setLoading(false);
    } catch (error) {
      setErrorMessage("Invalid credentials");
      console.error("Error logging in:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn) {
        router.replace("/");
      }
    }
  }, [router]);

  return (
    <Center style={{ height: "100vh", background: "#efefef" }}>
      <Paper radius="sm" p="xl" withBorder w={360}>
        <Center mb={24}>
          <img src="logo.png" alt="" width={120} />
        </Center>
        <form onSubmit={handleLogin}>
          <Stack>
            <TextInput
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
              label="Email"
              placeholder="Email"
              radius="sm"
              type="text"
            />
            <PasswordInput
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
                setErrorMessage("");
              }}
              required
              label="Password"
              placeholder="Password"
              radius="sm"
            />
          </Stack>

          {errorMessage && (
            <Text color="red" mt={10} mb={-5}>
              {errorMessage}
            </Text>
          )}

          <Group position="apart" mt="xl">
            <Button type="submit" radius="sm" disabled={!password || !email} loading={loading}>
              Login
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
}
