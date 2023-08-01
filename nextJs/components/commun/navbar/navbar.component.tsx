import { useRouter } from "next/router";
import styles from "./NavBar.module.scss";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.png";
import { useContext } from "react";
import { userContext } from "@/contexts/user-context";

import Settings from "../../../public/settings.svg";
import Friends from "../../../public/friends.svg";
import Logout from "../../../public/logou.svg";
import { Fetcher } from "@/utils/fetcher";

const NavBar = () => {
  const router = useRouter();

  const { currentUser } = useContext(userContext);

  const { setCurrentUser } = useContext(userContext);

  const signOut = async () => {
    try {
      await Fetcher("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      setCurrentUser(null);
      router.push("/");
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className={styles.navBar}>
      <div className={styles.logoContainer}>
        <Image
          src={Logo}
          alt="logo"
          width={100}
          height={100}
          className={styles.logo}
          onClick={() => router.push("/")}
        />
      </div>
      <div className={styles.centerContainer}>
        <p onClick={() => router.push("/")}>Home</p>
        <p onClick={() => router.push("/how-it-works")}>How it works</p>
      </div>
      <div className={styles.authContainer}>
        {!currentUser ? (
          <div className={styles.linksContainer}>
            <Link href={"/login"} className={styles.loginLink}>
              Login
            </Link>
            <Link href={"/join"} className={styles.joinNowLink}>
              Join now
            </Link>
          </div>
        ) : (
          <div className={styles.userMenu}>
            <Image
              src={currentUser?.profilePicture || "/logo.png"}
              width={100}
              height={100}
              alt="profile"
              className={styles.userPic}
              unoptimized
            />{" "}
            <div className={styles.friendsPic}>
              <Image
                src={Friends}
                width={100}
                height={100}
                alt="friends"
                className={styles.pic}
                unoptimized
              />{" "}
            </div>
            <div className={styles.settingsPic}>
              <Image
                src={Settings}
                width={100}
                height={100}
                alt="settings"
                className={styles.pic}
                unoptimized
              />{" "}
            </div>
            <div className={styles.logoutPic} onClick={signOut}>
              <Image
                src={Logout}
                width={100}
                height={100}
                alt="logout"
                className={styles.pic}
                unoptimized
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
