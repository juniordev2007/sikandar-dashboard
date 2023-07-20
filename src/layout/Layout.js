/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AppShell, Navbar, useMantineTheme, NavLink, Modal, Text, Group, Button } from "@mantine/core";
import { IconLayoutDashboard, IconAdjustments, IconLink, IconLogout } from "@tabler/icons-react";

export default function Layout({ children }) {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const theme = useMantineTheme();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setShowLogoutConfirmation(false);
    router.replace("/login");
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, []);

  return (
    <AppShell
      styles={{ main: { background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] } }}
      hidden={["/", "/login"].includes(router.pathname)}
      style={{ paddingRight: 0 }}
      className="main-shell"
      navbar={
        <Navbar p="md" width={{ sm: 170 }}>
          <Navbar.Section mt={-20} mb={-30}>
            <img src="logo.webp" alt="" width={140} />
          </Navbar.Section>
          <Navbar.Section mt={20}>
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                icon={link.icon}
                label={link.label}
                active={router.pathname === link.href}
                onClick={() => router.push(link.href)}
                py={14}
                mb={5}
                fz={16}
              />
            ))}
            <NavLink
              icon={<IconLogout strokeWidth={1.6} size={22} />}
              label="Logout"
              onClick={() => setShowLogoutConfirmation(true)}
              py={14}
              mb={10}
              fz={16}
            />
          </Navbar.Section>
        </Navbar>
      }
      px={20}>
      <Modal
        opened={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        title=""
        centered
        withCloseButton={false}
        padding="lg">
        <Text size={16}>Are you sure you want to logout?</Text>
        <Group position="right" mt={30} spacing={0}>
          <Button variant="subtle" fw={500} fz={16} onClick={() => setShowLogoutConfirmation(false)}>
            No
          </Button>
          <Button variant="subtle" fw={500} fz={16} onClick={handleLogout}>
            Yes
          </Button>
        </Group>
      </Modal>
      {children}
    </AppShell>
  );
}

const navLinks = [
  { id: 1, icon: <IconLayoutDashboard strokeWidth={1.6} size={22} />, label: "Spins", href: "/dashboard" },
  { id: 1, icon: <IconAdjustments strokeWidth={1.6} size={22} />, label: "Settings", href: "/settings" },
  { id: 1, icon: <IconLink strokeWidth={1.6} size={22} />, label: "Links", href: "/links" },
];
