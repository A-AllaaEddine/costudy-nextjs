import { ForwardedRef, forwardRef } from 'react';
import styles from './MessageBubble.module.scss';

type Message = {
  type: 'text';
  body: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
};

type Props = {
  message: Message;
  userId: string;
  last: boolean;
};
const MessageBubble = forwardRef(
  ({ message, userId, last }: Props, ref: ForwardedRef<any>) => {
    const { senderId, senderName, body } = message;
    const cardBody = (
      <div
        className={styles.message}
        style={{
          alignItems: senderId === userId ? 'flex-end' : 'flex-start',
        }}
      >
        <p className={styles.senderName}>{senderName}</p>
        <p
          style={{
            backgroundColor: senderId === userId ? '#2563EB' : '#79808B',
          }}
          className={styles.body}
        >
          {body}
        </p>
        {last ? (
          <p className={styles.status}>
            Sent{' '}
            {
              new Date(
                new Date(message?.timestamp).getTime() -
                  new Date(message?.timestamp).getTimezoneOffset() * 60000
              )
                .toISOString()
                .split('T')[0]
            }
          </p>
        ) : null}
      </div>
    );

    const content = ref ? (
      <div className={styles.message} ref={ref}>
        {cardBody}
      </div>
    ) : (
      <div className={styles.message}>{cardBody}</div>
    );

    return content;
  }
);

export default MessageBubble;
