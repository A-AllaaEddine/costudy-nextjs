import { useContext, useState } from "react";
import styles from "./LogIn.module.scss";
import { Fetcher } from "@/utils/fetcher";
import { withSessionSsr } from "@/lib/config/withSession";
import { userContext } from "@/contexts/user-context";
import Spinner from "@/components/commun/Spinner/spinner.component";
import { useRouter } from "next/router";
import { notificationsContext } from "@/contexts/notifications.context";
import { NextApiRequest, NextApiResponse } from "next";

export const getServerSideProps = withSessionSsr(
  async ({
    req,
    res,
    query,
    locale,
  }: {
    req: NextApiRequest;
    res: NextApiResponse;
    query: any;
    locale: any;
  }) => {
    const user = req.session.user;

    if (user) {
      return {
        redirect: {
          destination: "/",
          statusCode: 302,
        },
      };
    }

    return {
      props: {},
    };
  }
);

const defaultFormFields = {
  email: "",
  password: "",
};
const LogIn = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formFields;

  const { setCurrentUser } = useContext(userContext);
  const { addNotification } = useContext(notificationsContext);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.length < 1) {
      addNotification("warning", "Please type your email!");
      return;
    }

    if (password.length < 8) {
      // alert("password must be at least  8 chacacters !");
      addNotification("warning", "Password must be at least  8 chacacters !");
      return;
    }

    try {
      setIsLoading(true);
      const resp = await Fetcher("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (resp.ok) {
        const { user } = await resp.json();
        setCurrentUser(user);
        setIsLoading(false);
        if (user.type === "user") {
          router.push("/sessions");
        } else if (user.type === "admin") {
          router.push("/");
        }
      } else {
        const { error } = await resp.json();
        setIsLoading(false);
        switch (error) {
          case "No user":
            addNotification("warning", "No user with this email");
            break;
          case "Wrong Password":
            addNotification("warning", "Wrong Password !");
            break;
          case "suspended":
            addNotification("warning", "Your account has been suspended");
            break;
          case "banned":
            addNotification("warning", "Your account is banned");
            break;
          default:
            console.log("Error: " + error);
            break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.loginPage}>
      <p className={styles.title}>Oh! Is it exams time again ;)</p>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
        />
        <input
          className={styles.input}
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
        />
        <p className={styles.forgotPassword}>Forgot password?</p>
        <div className={styles.btnContainer}>
          {isLoading ? (
            <div className={styles.loginBtn}>
              <Spinner bgColor="#1d1d1f" />
            </div>
          ) : (
            <button type="submit" className={styles.loginBtn}>
              Log in
            </button>
          )}
        </div>
      </form>
      <p className={styles.notMember}>
        Not a member? <span onClick={() => router.push("/join")}>Join now</span>
      </p>
    </div>
  );
};

export default LogIn;
