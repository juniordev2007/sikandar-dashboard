import { Title } from '@mantine/core';

export default function Greeting({ username }) {
  return (
    <Title fw={600} order={1} color="blue" mb={24} size={22}>
      Welcome Back, {username}!
    </Title>
  );
}
