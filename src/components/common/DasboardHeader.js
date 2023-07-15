import { Avatar, Flex, Title } from '@mantine/core';

export default function DasboardHeader({ title }) {
  return (
    <Flex justify="space-between" align="center" mb={40}>
      <Title order={2} pt={10} fw={600}>
        {title}
      </Title>
      {/* <Avatar radius="xl" color="blue">
        Ad
      </Avatar> */}
    </Flex>
  );
}
