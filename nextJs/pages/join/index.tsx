import { useRouter } from "next/router";
import styles from "./SignUp.module.scss";
import { ChangeEvent, SyntheticEvent, useContext, useState } from "react";
import { notificationsContext } from "@/contexts/notifications.context";
import Spinner from "@/components/commun/Spinner/spinner.component";
import { Fetcher } from "@/utils/fetcher";
import { userContext } from "@/contexts/user-context";
import { withSessionSsr } from "@/lib/config/withSession";
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

const defaultFomFields = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUp = () => {
  const [formFields, setFormFields] = useState(defaultFomFields);
  const [isLoading, setIsLoading] = useState(false);

  const { name, email, password, confirmPassword } = formFields;

  const { addNotification } = useContext(notificationsContext);

  const router = useRouter();

  const { setCurrentUser } = useContext(userContext);

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (email.length === 0) {
      addNotification("warning", "Please type your email!");
      return;
    }

    if (password.length < 8) {
      addNotification("warning", "Password must be at least  8 chacacters !");
      return;
    }

    if (password !== confirmPassword) {
      addNotification("warning", "Password is not matching !");
      return;
    }

    try {
      setIsLoading(true);
      const resp = await Fetcher("/api/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
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
        if (error === "Email already exist") {
          addNotification("warning", "Email already exist !");
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.signupPage}>
      <p className={styles.title}>Welcome to the family</p>
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          name="name"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={handleChange}
        />{" "}
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
        />{" "}
        <input
          className={styles.input}
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={handleChange}
        />
        <div className={styles.btnContainer}>
          {isLoading ? (
            <div className={styles.signupBtn}>
              <Spinner bgColor="#1d1d1f" />
            </div>
          ) : (
            <button type="submit" className={styles.signupBtn}>
              Sign up
            </button>
          )}
        </div>
        <p className={styles.terms}>
          By creating an account, you agree to Cofocus's{" "}
          <span>Terms of Service</span> and <span>Privacy Policy</span>.
        </p>
      </form>
      <p className={styles.notMember}>
        Already a member?{" "}
        <span onClick={() => router.push("/login")}>Log in</span>
      </p>
    </div>
  );
};

export default SignUp;
