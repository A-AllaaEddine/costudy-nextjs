'use client';

import { useParams, useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { Fetcher } from '@/utils/fetcher';
import { io } from 'socket.io-client';
import MessageBox from '@/components/modules/session/messages-box/messages-box.component';
import { NextApiRequest, NextApiResponse } from 'next';
import { Socket } from 'socket.io-client';
import { checkServerSession } from '@/utils/serserSideUtils';

type Message = {
  type: 'text';
  body: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
};

const Session = () => {
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const router = useRouter();
  const params = useParams();

  const checkSession = async (sessionId: string) => {
    try {
      const resp = await Fetcher('http://192.168.1.9:3002/checkSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (resp.ok) {
        console.log('session joined');
        const skt = io('http://192.168.1.9:3002');
        setSocket(skt);
        skt.on('connect', () => {
          console.log('connected');
          skt?.emit('joinSession', params.sessionId);
        });
      } else {
        const data = await resp.json();
        if (data.error) {
          console.log('Error: ', data.error);
          // alert("There was an error joining this session !");
          setErrorMessage('There was an error joining this session !');
        } else {
          setErrorMessage("session doesn't exit !");
        }
        return false;
      }
    } catch (error) {
      console.log('Error: ', error);
      alert('There was an error joining this session !');
    }
  };

  useEffect(() => {
    if (params.sessionId) {
      checkSession(params.sessionId as string);
    }
  }, [params]);

  if (errorMessage.length > 0) {
    return (
      <div
        style={{
          width: '100%',
          height: 500,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Session doesn't exist.
      </div>
    );
  }

  return (
    <div>
      <h1>Chat</h1>
      <div></div>
      {/* <MessageBox
        socket={socket}
        setMessages={setMessages}
        messages={messages}
      /> */}
    </div>
  );
};

export default Session;
