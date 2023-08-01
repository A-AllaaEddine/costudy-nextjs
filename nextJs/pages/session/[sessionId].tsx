import { useRouter } from "next/router";
import styles from "./Session.module.scss";
import { useEffect, useState } from "react";
import { withSessionSsr } from "@/lib/config/withSession";
import { Fetcher } from "@/utils/fetcher";
import { io } from "socket.io-client";
import MessageBox from "@/components/modular/session/messages-box/messages-box.component";
import { NextApiRequest, NextApiResponse } from "next";
import { Socket } from "socket.io-client";

type Message = {
  type: "text";
  body: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
};

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

    if (!user) {
      return {
        redirect: {
          destination: "/login",
          statusCode: 302,
        },
      };
    }

    return {
      props: {},
    };
  }
);

let socket;

const Session = () => {
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const router = useRouter();

  const checkSession = async (sessionId: string) => {
    try {
      const resp = await Fetcher("http://192.168.1.9:3002/checkSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (resp.ok) {
        console.log("session joined");
        const skt = io("http://192.168.1.9:3002");
        setSocket(skt);
        skt.on("connect", () => {
          console.log("connected");
          skt?.emit("joinSession", router.query.sessionId);
        });
        skt?.on("message", (data: Message) => {
          // console.log("Received message:", data);
          setMessages((prev) => [data, ...prev]);
        });
      } else {
        const data = await resp.json();
        if (data.error) {
          console.log("Error: ", data.error);
          // alert("There was an error joining this session !");
          setErrorMessage("There was an error joining this session !");
        } else {
          setErrorMessage("session doesn't exit !");
        }
        return false;
      }
    } catch (error) {
      console.log("Error: ", error);
      alert("There was an error joining this session !");
    }
  };

  useEffect(() => {
    if (router.isReady) {
      checkSession(router.query.sessionId as string);
    }
  }, [router]);

  if (errorMessage.length > 0) {
    return (
      <div
        style={{
          width: "100%",
          height: 500,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Session doesn't exist.
      </div>
    );
  }

  return (
    <div className={styles.sessionPage}>
      <h1>Chat</h1>
      <div className={styles.chatBox}></div>
      <MessageBox
        socket={socket}
        setMessages={setMessages}
        messages={messages}
      />
    </div>
  );
};

export default Session;
