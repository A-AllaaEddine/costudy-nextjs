import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { Socket } from 'socket.io-client';
import styles from './InputBar.module.scss';

import Toast from '@/components/commun/static/Toast';
import { useSession } from 'next-auth/react';

type Props = {
  socket: Socket;
  scrollToLastMessage: () => void;
};

const InputBar = ({ scrollToLastMessage, socket }: Props) => {
  const [newMessage, setNewMessage] = useState<string>('');

  const router = useRouter();
  const { data: session } = useSession();

  const sendMessage = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (newMessage.trim().length > 0) return;

    try {
      // setStatus("sending");

      // await socket.emit('chatMessage', router.query.sessionId, {
      //   type: 'text',
      //   body: newMessage,
      //   senderId: session?.user?.id,
      //   senderName: session?.user?.name,
      //   timestamp: new Date(),
      // });

      // setStatus("sent");
      setNewMessage('');
      scrollToLastMessage();
    } catch (error) {
      Toast('error', 'There was an error sending your message.');
      console.log(error);
    }
  };
  return (
    <form className={styles.inputContainer} onSubmit={sendMessage}>
      <input
        type="text"
        name="message"
        placeholder="Type your message ..."
        value={newMessage}
        onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
          setNewMessage(e.target.value)
        }
      />
      <Image
        src={'/send.png'}
        alt="chat"
        width={100}
        height={100}
        quality={100}
        unoptimized
        priority
        className={styles.icon}
        onClick={sendMessage}
      />
    </form>
  );
};

export default InputBar;
