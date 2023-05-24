'use client';
import { cn } from '@/lib/utils';
import { validMessageType } from '@/lib/validations/message';
import React, { useRef, useState } from 'react';

type MessagesProps = {
  initialMessages: validMessageType[];
  sessionId: string;
};

const Messages = ({ initialMessages, sessionId }: MessagesProps) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<validMessageType[]>(initialMessages);

  messages.map((m) => console.log(m.senderId));

  return (
    <div
      id='messages'
      className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
    >
      <div ref={scrollDownRef}>
        {messages.map((m, i) => {
          let currentMessageIndex = i === 0 ? 1 : i;

          const isCurrentUser = m.senderId === sessionId;
          const hasNextMessageFromSameUser =
            messages[currentMessageIndex - 1].senderId ===
            messages[currentMessageIndex].senderId;

          return (
            <div key={`${m.id}-${m.timestamp}`} className='chat-message'>
              <div
                className={cn('flex items-end', {
                  'justify-end': isCurrentUser,
                })}
              >
                <div
                  className={cn(
                    'flex flex-col space-y-2 text-base max-w-xs mx-2',
                    {
                      'order-1 items-end': isCurrentUser,
                      'order-é items-start': !isCurrentUser,
                    }
                  )}
                >
                  <span
                    className={cn('px-4 py-2 rounded-lg inline-block', {
                      'bg-indigo-600 text-white': isCurrentUser,
                      'bg-gray-200 text-gray-900': !isCurrentUser,
                      'rounded-br-none':
                        !hasNextMessageFromSameUser && isCurrentUser,
                      'rounded-bl-none':
                        !hasNextMessageFromSameUser && !isCurrentUser,
                    })}
                  >
                    {m.text}{' '}
                    <span className='ml-2 text-xs text-gray-400'></span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
