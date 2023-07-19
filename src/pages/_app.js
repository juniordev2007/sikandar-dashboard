import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import Layout from "@/layout/Layout";
import AppProvider from "@/context/AppContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/logo.webp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Sikander Dasboard</title>
      </Head>

      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ fontFamily: "Poppins, sans-serif" }}>
        <DatesProvider settings={{ locale: "ru", firstDayOfWeek: 0, weekendDays: [0] }}>
          <AppProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AppProvider>
        </DatesProvider>
      </MantineProvider>
    </>
  );
}
