import Image from 'next/image';
import styles from './InputBar.module.scss';
import { ChangeEvent, SyntheticEvent, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { userContext } from '@/contexts/user-context';
import { Socket } from 'socket.io-client';

import Toast from '@/components/commun/static/toast';

type Props = {
  socket: Socket;
  scrollToLastMessage: () => void;
};

const InputBar = ({ scrollToLastMessage, socket }: Props) => {
  const [newMessage, setNewMessage] = useState<string>('');

  const { currentUser } = useContext(userContext);

  const sendMessage = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (newMessage.trim().length > 0) return;

    try {
      // setStatus("sending");

      await socket.emit('chatMessage', router.query.sessionId, {
        type: 'text',
        body: newMessage,
        senderId: currentUser?._id,
        senderName: currentUser?.name,
        timestamp: new Date(),
      });

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
