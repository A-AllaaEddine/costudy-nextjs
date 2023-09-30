import useMessagesDocs from '@/hooks/useMessagesDocs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Socket } from 'socket.io-client';
import InputBar from '../input-bar/input-bar.component';
import MessageBubble from '../message-bubble/message-bubble.component';
import styles from './MessagesBox.module.scss';

type Message = {
  type: 'text';
  body: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
};

type Props = {
  socket: Socket;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<[] | Message[]>>;
};
const MessageBox = ({ socket, setMessages, messages }: Props) => {
  const [hookData, setHookData] = useState({
    page: 1,
    sessionId: '',
  });
  const { page } = hookData;

  const { data: session } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setHookData({ page: 1, sessionId: router.query.sessionId as string });
    }
  }, [router]);

  useEffect(() => {
    socket?.on('message', (data) => {
      setMessages((prev) => [data, ...prev]);
    });
  }, [socket]);

  const { results, isLoading, isError, error, hasMoreDocs } =
    useMessagesDocs(hookData);

  useEffect(() => {
    setMessages((prev: Message[]) => [...prev, ...results]);
  }, [results]);

  const intObserver = useRef<IntersectionObserver | null>();

  const lastDocRef = useCallback(
    (doc: Element | null) => {
      if (isLoading) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((doc) => {
        if (doc[0].isIntersecting && hasMoreDocs) {
          // console.log("We are near the last post!");
          setHookData({ ...hookData, page: page + 1 });
        }
      });
      if (doc) intObserver.current.observe(doc);
    },
    [isLoading, hasMoreDocs]
  );

  const latestMsg = useRef(null);

  const content = messages.map((msg, i) => {
    if (messages.length >= 19) {
      return (
        <MessageBubble
          key={i}
          ref={messages.length === i + 1 ? lastDocRef : null}
          last={i === 0 ? true : false}
          message={msg}
          userId={session?.user?.id!}
        />
      );
    } else {
      return (
        <MessageBubble
          key={i}
          message={msg}
          userId={session?.user?.id!}
          last={i === 0 ? true : false}
        />
      );
    }
  });

  const scrollToLastMessage = () => {
    if (latestMsg.current) {
      // latestMsg.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.messagesBox}>
      <div className={styles.messagesContainer}>
        {content}
        {isLoading && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#1d1d1f',
            }}
          >
            <p>Loading...</p>
          </div>
        )}
        {!isLoading && !content.length && !isError && (
          <div className={styles.noResultsContainer}>
            <p className={styles.noResults}>No Messages</p>
          </div>
        )}
        {isError && (
          <p
            style={{
              width: '100%',
              height: '500px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontFamily: 'Poppins',
              fontWeight: '600',
              fontSize: 20,
              zIndex: 5,
              color: '#1d1d1f',
            }}
          >
            Error: {error}
          </p>
        )}
      </div>
      <InputBar socket={socket} scrollToLastMessage={scrollToLastMessage} />
    </div>
  );
};

export default MessageBox;
