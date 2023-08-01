import Layout from "../components/commun/layout";
import { NotificationsProvider } from "@/contexts/notifications.context";
import { UserProvider } from "@/contexts/user-context";
import "@/styles/globals.css";
import { AppProps } from "next/app";
import NextTopLoader from "nextjs-toploader";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextTopLoader color={"#e6a0ff"} />
      <UserProvider>
        <NotificationsProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NotificationsProvider>
      </UserProvider>
    </>
  );
}
