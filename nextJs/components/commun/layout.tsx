import { useContext, useEffect } from "react";
import CustomNotification from "./custom-notification/custom-notification.component";
import { userContext } from "@/contexts/user-context";
import { Fetcher } from "@/utils/fetcher";

import NavBar from "./navbar/navbar.component";

type User = {
  token: string;
  type: string;
  _id: string;
  name: string;
  username: string;
  expiration: number;
  profilePicture: string;
};

const Layout = ({ children }) => {
  const { setCurrentUser } = useContext(userContext);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const resp = await Fetcher("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (resp.ok) {
          const { user }: { user: User | undefined } = await resp.json();
          setCurrentUser(user);
          // console.log("logged in");
        } else {
          const { error }: { error: string } = await resp.json();
          if (error !== "Unauthorized") {
            setCurrentUser(null);
            console.log("Error: " + error);
          }
          if (error === "invalid signature") {
            setCurrentUser(null);
            // setInvalidToken(true);
          } else if (error === "jwt expired") {
            setCurrentUser(null);
            // setExpiredToken(true);
          } else if (error === "Email not confirmed") {
            setCurrentUser(null);
            // setTryAgainLater(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkUser();
  }, []);

  return (
    <>
      <NavBar />
      <CustomNotification />
      <main>{children}</main>
    </>
  );
};

export default Layout;
